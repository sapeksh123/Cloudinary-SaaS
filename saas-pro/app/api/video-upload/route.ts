import { v2 as cloudinary } from 'cloudinary';
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { Readable } from 'stream';
import { auth } from '@clerk/nextjs/server';
const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResponse {
    public_id: string;
    bytes: number;
    duration?: number;
    [key: string]: unknown;
}

function bufferToStream(buffer: Buffer) {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
}

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized User', { status: 401 });
        }

        try {
            await prisma.$connect();
        } catch (dbError) {
            console.error('Database connection failed:', dbError);
            return new NextResponse('Database connection failed', {
                status: 500,
            });
        }

        if (
            !process.env.DATABASE_URL ||
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            console.error('Server is missing required environment variables for video upload');
            return new NextResponse('Server misconfiguration', { status: 500 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const originalSize = formData.get('originalSize') as string;

        if (!file) {
            return new NextResponse('No file uploaded', { status: 400 });
        }

        if (!title || title.trim() === '') {
            return new NextResponse('Title is required', { status: 400 });
        }

        if (file.size > MAX_VIDEO_SIZE) {
            return new NextResponse('File size exceeds 100MB limit', {
                status: 400,
            });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResponse>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'video',
                        folder: 'saas-pro-videos-upload',
                        transformation: [
                            { quality: 'auto', fetch_format: 'mp4' },
                        ],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResponse);
                    }
                );
                bufferToStream(buffer).pipe(uploadStream);
            }
        );

        if (!result.public_id) {
            throw new Error('Failed to get public_id from Cloudinary upload');
        }

        const video = await prisma.video.create({
            data: {
                userId,
                title,
                description,
                publicId: result.public_id,
                originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0,
            },
        });

        return NextResponse.json(video);
    } catch (error) {
        console.error('Error uploading video:', error);
        return new NextResponse('Error uploading video', { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
