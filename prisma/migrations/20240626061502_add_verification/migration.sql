/*
  Warnings:

  - A unique constraint covering the columns `[verificationToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resetPasswordToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `resetPasswordToken` VARCHAR(191) NULL,
    ADD COLUMN `verificationToken` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_verificationToken_key` ON `users`(`verificationToken`);

-- CreateIndex
CREATE UNIQUE INDEX `users_resetPasswordToken_key` ON `users`(`resetPasswordToken`);
