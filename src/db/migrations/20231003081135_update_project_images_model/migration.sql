/*
  Warnings:

  - Added the required column `url` to the `ProjectImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectImages" ADD COLUMN     "url" TEXT NOT NULL;
