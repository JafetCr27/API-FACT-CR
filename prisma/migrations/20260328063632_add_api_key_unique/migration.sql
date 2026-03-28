/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Company` table. All the data in the column will be lost.
  - Added the required column `xmlFirmado` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Made the column `xml` on table `Document` required. This step will fail if there are existing NULL values in that column.
  - Made the column `response` on table `Document` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Document_clave_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "xmlFirmado" TEXT NOT NULL,
ALTER COLUMN "xml" SET NOT NULL,
ALTER COLUMN "response" SET NOT NULL;
