-- AlterTable
ALTER TABLE `users` ADD COLUMN `failedAttempts` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `lockoutEndTime` DATETIME(3) NULL;
