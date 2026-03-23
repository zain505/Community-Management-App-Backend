-- AlterTable
ALTER TABLE `Store` MODIFY `image` LONGTEXT NOT NULL;

-- CreateTable
CREATE TABLE `StoreRating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `rating` DECIMAL(4, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `storeId` INTEGER NOT NULL,

    UNIQUE INDEX `StoreRating_storeId_userId_key`(`storeId`, `userId`),
    INDEX `StoreRating_storeId_idx`(`storeId`),
    INDEX `StoreRating_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Backfill legacy store ratings so existing non-zero ratings continue to contribute
-- to the average when the first real user rating arrives after this migration.
INSERT INTO `StoreRating` (`userId`, `rating`, `createdAt`, `updatedAt`, `storeId`)
SELECT
    CONCAT('__legacy_store_', `id`) AS `userId`,
    CAST(`rating` AS DECIMAL(4, 2)) AS `rating`,
    CURRENT_TIMESTAMP(3) AS `createdAt`,
    CURRENT_TIMESTAMP(3) AS `updatedAt`,
    `id` AS `storeId`
FROM `Store`
WHERE CAST(`rating` AS DECIMAL(4, 2)) > 0;

-- AddForeignKey
ALTER TABLE `StoreRating` ADD CONSTRAINT `StoreRating_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
