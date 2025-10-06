/*
  Warnings:

  - You are about to drop the column `city` on the `allCarsList` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `allCarsList` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `allCarsList` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `allCarsList` table. All the data in the column will be lost.
  - You are about to drop the column `phoneCode` on the `allCarsList` table. All the data in the column will be lost.
  - You are about to drop the column `transmission` on the `allCarsList` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `userJournal` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `userJournal` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `userJournal` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `userJournal` table. All the data in the column will be lost.
  - You are about to drop the column `phoneCode` on the `userJournal` table. All the data in the column will be lost.
  - You are about to drop the column `transmission` on the `userJournal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "allCarsList" DROP COLUMN "city",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "phoneCode",
DROP COLUMN "transmission";

-- AlterTable
ALTER TABLE "userJournal" DROP COLUMN "city",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "phoneCode",
DROP COLUMN "transmission";
