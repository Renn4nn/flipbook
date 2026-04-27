/*
  Warnings:

  - A unique constraint covering the columns `[accessToken]` on the table `Document` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pages` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pages" INTEGER NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "title" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Document_accessToken_key" ON "Document"("accessToken");
