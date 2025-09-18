/*
  Warnings:

  - You are about to drop the column `usertype` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "usertype",
ADD COLUMN     "role" TEXT;
