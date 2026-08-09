-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."Video" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "publicId" TEXT NOT NULL,
    "originalSize" TEXT NOT NULL,
    "compressedSize" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "publicId" TEXT NOT NULL,
    "originalSize" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "tags" TEXT[],
    "extractedText" TEXT,
    "hasBackgroundRemoved" BOOLEAN NOT NULL DEFAULT false,
    "isEnhanced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aiCaption" TEXT,
    "objectDetection" JSONB,
    "qualityLevel" TEXT,
    "qualityScore" DOUBLE PRECISION,
    "watermarkDetected" TEXT,
    "aiVisionGeneral" JSONB,
    "aiVisionModeration" JSONB,
    "aiVisionTags" JSONB,
    "tokensUsed" INTEGER,
    "faceCount" INTEGER,
    "facesBoundingBoxes" JSONB,
    "facialAttributes" JSONB,
    "facialLandmarks" JSONB,
    "hasFaces" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "originalPublicId" TEXT NOT NULL,
    "pdfPublicId" TEXT,
    "thumbnailPublicId" TEXT,
    "originalSize" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "conversionStatus" TEXT NOT NULL DEFAULT 'pending',
    "pageCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Video_userId_idx" ON "public"."Video"("userId");

-- CreateIndex
CREATE INDEX "Image_userId_idx" ON "public"."Image"("userId");

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "public"."Document"("userId");

