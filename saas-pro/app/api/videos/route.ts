import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const video = await prisma.video.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(video);
    } catch (error) {
        console.error('Error fetching videos:', error);
        return NextResponse.json(
            { error: 'Failed to fetch videos' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
