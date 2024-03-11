/*
  Warnings:

  - You are about to drop the column `parentId` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_parentId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "parentId";
