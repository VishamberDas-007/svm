/*
  Warnings:

  - Changed the type of `group` on the `Permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "group",
ADD COLUMN     "group" TEXT NOT NULL;
