-- CreateTable
CREATE TABLE `NewsFeedSave` (
    `id` VARCHAR(191) NOT NULL,
    `newsFeedItemId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `savedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    INDEX `NewsFeedSave_userId_expiresAt_idx`(`userId`, `expiresAt`),
    INDEX `NewsFeedSave_expiresAt_idx`(`expiresAt`),
    INDEX `NewsFeedSave_savedAt_idx`(`savedAt`),
    UNIQUE INDEX `NewsFeedSave_newsFeedItemId_userId_key`(`newsFeedItemId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NewsFeedSave` ADD CONSTRAINT `NewsFeedSave_newsFeedItemId_fkey` FOREIGN KEY (`newsFeedItemId`) REFERENCES `NewsFeedItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
