-- AlterTable
ALTER TABLE `Store`
  ADD COLUMN `searchCount` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `NewsFeedItem` (
  `id` VARCHAR(191) NOT NULL,
  `type` ENUM(
    'STORE_CREATED',
    'STORE_NAME_UPDATED',
    'STORE_RATING_UPDATED',
    'STORE_PROFILE_UPDATED',
    'PRODUCT_ADDED',
    'PRODUCT_UPDATED',
    'POPULAR_STORE_CHANGED',
    'MOST_ACTIVE_STORE_CHANGED',
    'MOST_SEARCHED_STORE_CHANGED'
  ) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `storeId` INTEGER NULL,
  `storeName` VARCHAR(191) NULL,
  `metadata` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsFeedMetricState` (
  `metric` ENUM('POPULAR_STORE', 'MOST_ACTIVE_STORE', 'MOST_SEARCHED_STORE') NOT NULL,
  `storeId` INTEGER NULL,
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`metric`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `NewsFeedItem_storeId_idx` ON `NewsFeedItem`(`storeId`);

-- CreateIndex
CREATE INDEX `NewsFeedItem_createdAt_idx` ON `NewsFeedItem`(`createdAt`);

-- CreateIndex
CREATE INDEX `NewsFeedItem_type_idx` ON `NewsFeedItem`(`type`);

-- CreateIndex
CREATE INDEX `NewsFeedMetricState_storeId_idx` ON `NewsFeedMetricState`(`storeId`);

-- AddForeignKey
ALTER TABLE `NewsFeedItem`
  ADD CONSTRAINT `NewsFeedItem_storeId_fkey`
  FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsFeedMetricState`
  ADD CONSTRAINT `NewsFeedMetricState_storeId_fkey`
  FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
