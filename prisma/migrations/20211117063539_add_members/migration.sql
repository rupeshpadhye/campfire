/*
  Warnings:

  - You are about to drop the column `email` on the `eventInvites` table. All the data in the column will be lost.
  - Added the required column `userId` to the `eventInvites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `eventInvites` DROP COLUMN `email`,
    ADD COLUMN `userId` INTEGER NOT NULL;
