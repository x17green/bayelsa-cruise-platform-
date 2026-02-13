/*
  Warnings:

  - A unique constraint covering the columns `[bookingReference]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TripScheduleStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "bookingReference" TEXT,
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "qrCode" TEXT;

-- AlterTable
ALTER TABLE "Operator" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "rating" DECIMAL(3,2);

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "amenities" JSONB DEFAULT '[]',
ADD COLUMN     "category" TEXT,
ADD COLUMN     "highlights" JSONB DEFAULT '[]',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "TripSchedule" ADD COLUMN     "arrivalPort" TEXT,
ADD COLUMN     "bookedSeats" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "departurePort" TEXT,
ADD COLUMN     "status" "TripScheduleStatus" NOT NULL DEFAULT 'scheduled';

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" UUID,
    "changes" JSONB,
    "metadata" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingReference_key" ON "Booking"("bookingReference");

-- CreateIndex
CREATE INDEX "Booking_bookingReference_idx" ON "Booking"("bookingReference");

-- CreateIndex
CREATE INDEX "Booking_paymentStatus_idx" ON "Booking"("paymentStatus");

-- CreateIndex
CREATE INDEX "Trip_category_idx" ON "Trip"("category");

-- CreateIndex
CREATE INDEX "Trip_isActive_idx" ON "Trip"("isActive");

-- CreateIndex
CREATE INDEX "TripSchedule_status_idx" ON "TripSchedule"("status");
