-- AlterTable
ALTER TABLE `ChatMessage`
    ADD COLUMN `type` ENUM('text', 'image', 'audio') NOT NULL DEFAULT 'text';

-- CreateTable
CREATE TABLE `ChatAttachment` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('image', 'audio') NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `storagePath` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `sizeBytes` INTEGER NOT NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `durationMillis` INTEGER NULL,
    `status` ENUM('uploaded', 'attached', 'expired', 'deleted') NOT NULL DEFAULT 'uploaded',
    `expiresAt` DATETIME(3) NULL,
    `consumedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdByUserId` VARCHAR(191) NOT NULL,
    `messageId` VARCHAR(191) NULL,

    INDEX `ChatAttachment_createdAt_idx`(`createdAt`),
    INDEX `ChatAttachment_expiresAt_idx`(`expiresAt`),
    INDEX `ChatAttachment_messageId_idx`(`messageId`),
    INDEX `ChatAttachment_createdByUserId_status_idx`(`createdByUserId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChatAttachment`
    ADD CONSTRAINT `ChatAttachment_messageId_fkey`
    FOREIGN KEY (`messageId`) REFERENCES `ChatMessage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
