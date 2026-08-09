import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();

        const signature = request.headers.get('x-cld-signature');
        const timestamp = request.headers.get('x-cld-timestamp');

        if (!signature || !timestamp) {
            console.error('Webhook rejected: missing Cloudinary signature headers');
            return new NextResponse('Missing signature', { status: 401 });
        }

        const isValid = cloudinary.utils.verifyNotificationSignature(
            rawBody,
            Number(timestamp),
            signature
        );

        if (!isValid) {
            console.error('Webhook rejected: invalid Cloudinary signature');
            return new NextResponse('Invalid signature', { status: 401 });
        }

        const body = JSON.parse(rawBody);

        if (body.notification_type === 'info' && body.info_kind === 'aspose') {
            const { public_id, info_status } = body;

            const document = await prisma.document.findFirst({
                where: { originalPublicId: public_id },
            });

            if (!document) {
                console.error('Document not found for public_id:', public_id);
                return new NextResponse('Document not found', { status: 404 });
            }

            if (info_status === 'complete') {
                const pdfPublicId = `${public_id}.pdf`;
                const thumbnailPublicId = `${public_id}_thumb`;

                try {
                    await prisma.document.update({
                        where: { id: document.id },
                        data: {
                            conversionStatus: 'complete',
                            pdfPublicId,
                            thumbnailPublicId,
                        },
                    });

                    console.log('Document conversion completed:', public_id);
                } catch (error) {
                    console.error('Error updating document:', error);

                    await prisma.document.update({
                        where: { id: document.id },
                        data: { conversionStatus: 'failed' },
                    });
                }
            } else if (info_status === 'failed') {
                await prisma.document.update({
                    where: { id: document.id },
                    data: { conversionStatus: 'failed' },
                });

                console.error('Document conversion failed:', public_id);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return new NextResponse('Webhook error', { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
