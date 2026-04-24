/*
  Warnings:

  - A unique constraint covering the columns `[directionId,normalizedText]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `normalizedText` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "normalizedText" TEXT NOT NULL,
ALTER COLUMN "answer" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Question_directionId_normalizedText_key" ON "Question"("directionId", "normalizedText");
