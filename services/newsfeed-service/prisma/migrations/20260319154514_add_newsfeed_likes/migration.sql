-- AlterTable
ALTER TABLE `newsfeeditem` MODIFY `description` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `NewsFeedLike` (
    `id` VARCHAR(191) NOT NULL,
    `newsFeedItemId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `NewsFeedLike_userId_idx`(`userId`),
    INDEX `NewsFeedLike_createdAt_idx`(`createdAt`),
    UNIQUE INDEX `NewsFeedLike_newsFeedItemId_userId_key`(`newsFeedItemId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NewsFeedLike` ADD CONSTRAINT `NewsFeedLike_newsFeedItemId_fkey` FOREIGN KEY (`newsFeedItemId`) REFERENCES `NewsFeedItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
