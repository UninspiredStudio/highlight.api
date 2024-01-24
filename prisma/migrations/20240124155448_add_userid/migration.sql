/*
  Warnings:

  - A unique constraint covering the columns `[userId,xPath,text]` on the table `Highlight` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Highlight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Highlight" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Highlight_userId_xPath_text_key" ON "Highlight"("userId", "xPath", "text");
