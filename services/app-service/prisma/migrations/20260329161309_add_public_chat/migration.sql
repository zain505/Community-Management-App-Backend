-- AlterTable
ALTER TABLE `announcement` ALTER COLUMN `authorName` DROP DEFAULT;

-- CreateTable
CREATE TABLE `ChatMessage` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `authorName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdByUserId` VARCHAR(191) NOT NULL,

    INDEX `ChatMessage_createdAt_idx`(`createdAt`),
    INDEX `ChatMessage_createdByUserId_idx`(`createdByUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
