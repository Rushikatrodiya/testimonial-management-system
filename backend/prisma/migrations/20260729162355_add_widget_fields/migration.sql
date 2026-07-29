-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "flagReason" TEXT,
ADD COLUMN     "isDuplicate" BOOLEAN NOT NULL DEFAULT false;
