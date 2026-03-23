-- Fresh MySQL bootstrap for the current backend schema.
-- Source of truth used for this file:
--   1. service-level Prisma schemas
--   2. final migration state under each service's prisma/migrations directory
--
-- Notes:
-- - api-gateway reuses auth_db and does not need its own database.
-- - app-service currently keeps its own User and RefreshToken tables in app_db.
-- - This script is intended for a brand new environment.
-- - If you use this script to create tables manually, do not run Prisma migrations on the
--   same empty databases afterward unless you also baseline `_prisma_migrations`.

CREATE DATABASE IF NOT EXISTS `auth_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `store_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `newsfeed_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS `app_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `auth_db`;

CREATE TABLE IF NOT EXISTS `User` (
    `id` VARCHAR(191) NOT NULL,
    `mobileNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `profile` JSON NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_mobileNumber_key` (`mobileNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `RefreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RefreshToken_tokenHash_key` (`tokenHash`),
    INDEX `RefreshToken_userId_idx` (`userId`),
    INDEX `RefreshToken_expiresAt_idx` (`expiresAt`),
    PRIMARY KEY (`id`),
    CONSTRAINT `RefreshToken_userId_fkey`
      FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
      ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `store_db`;

CREATE TABLE IF NOT EXISTS `Store` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ownerUserId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `rating` VARCHAR(191) NOT NULL,
    `image` LONGTEXT NOT NULL,
    `badges` JSON NULL,
    `delivery` VARCHAR(191) NOT NULL,
    `minOrderRs` VARCHAR(191) NOT NULL,
    `openingTime` VARCHAR(191) NOT NULL DEFAULT '00:00',
    `closingTime` VARCHAR(191) NOT NULL DEFAULT '23:59',
    `phoneNumber` VARCHAR(191) NOT NULL,
    `searchCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Store_ownerUserId_key` (`ownerUserId`),
    INDEX `Store_name_idx` (`name`),
    INDEX `Store_location_idx` (`location`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `StoreProduct` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `tag` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `storeId` INTEGER NOT NULL,

    INDEX `StoreProduct_storeId_idx` (`storeId`),
    INDEX `StoreProduct_name_idx` (`name`),
    PRIMARY KEY (`id`),
    CONSTRAINT `StoreProduct_storeId_fkey`
      FOREIGN KEY (`storeId`) REFERENCES `Store` (`id`)
      ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `StoreRating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `rating` DECIMAL(4, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `storeId` INTEGER NOT NULL,

    UNIQUE INDEX `StoreRating_storeId_userId_key` (`storeId`, `userId`),
    INDEX `StoreRating_storeId_idx` (`storeId`),
    INDEX `StoreRating_userId_idx` (`userId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `StoreRating_storeId_fkey`
      FOREIGN KEY (`storeId`) REFERENCES `Store` (`id`)
      ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `newsfeed_db`;

CREATE TABLE IF NOT EXISTS `NewsFeedItem` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM(
      'STORE_CREATED',
      'STORE_NAME_UPDATED',
      'STORE_LOCATION_UPDATED',
      'STORE_RATING_UPDATED',
      'STORE_IMAGE_UPDATED',
      'STORE_DELIVERY_UPDATED',
      'STORE_MIN_ORDER_UPDATED',
      'STORE_CONTACT_UPDATED',
      'STORE_PROFILE_UPDATED',
      'PRODUCT_ADDED',
      'PRODUCT_UPDATED',
      'PRODUCT_DELETED',
      'ANNOUNCEMENT_CREATED',
      'ANNOUNCEMENT_UPDATED',
      'ANNOUNCEMENT_DELETED',
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

    INDEX `NewsFeedItem_storeId_idx` (`storeId`),
    INDEX `NewsFeedItem_createdAt_idx` (`createdAt`),
    INDEX `NewsFeedItem_type_idx` (`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `NewsFeedMetricState` (
    `metric` ENUM('POPULAR_STORE', 'MOST_ACTIVE_STORE', 'MOST_SEARCHED_STORE') NOT NULL,
    `storeId` INTEGER NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `NewsFeedMetricState_storeId_idx` (`storeId`),
    PRIMARY KEY (`metric`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `NewsFeedLike` (
    `id` VARCHAR(191) NOT NULL,
    `newsFeedItemId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `NewsFeedLike_userId_idx` (`userId`),
    INDEX `NewsFeedLike_createdAt_idx` (`createdAt`),
    UNIQUE INDEX `NewsFeedLike_newsFeedItemId_userId_key` (`newsFeedItemId`, `userId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `NewsFeedLike_newsFeedItemId_fkey`
      FOREIGN KEY (`newsFeedItemId`) REFERENCES `NewsFeedItem` (`id`)
      ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `NewsFeedSave` (
    `id` VARCHAR(191) NOT NULL,
    `newsFeedItemId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `savedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    INDEX `NewsFeedSave_userId_expiresAt_idx` (`userId`, `expiresAt`),
    INDEX `NewsFeedSave_expiresAt_idx` (`expiresAt`),
    INDEX `NewsFeedSave_savedAt_idx` (`savedAt`),
    UNIQUE INDEX `NewsFeedSave_newsFeedItemId_userId_key` (`newsFeedItemId`, `userId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `NewsFeedSave_newsFeedItemId_fkey`
      FOREIGN KEY (`newsFeedItemId`) REFERENCES `NewsFeedItem` (`id`)
      ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `app_db`;

CREATE TABLE IF NOT EXISTS `User` (
    `id` VARCHAR(191) NOT NULL,
    `mobileNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_mobileNumber_key` (`mobileNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `RefreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RefreshToken_tokenHash_key` (`tokenHash`),
    INDEX `RefreshToken_userId_idx` (`userId`),
    INDEX `RefreshToken_expiresAt_idx` (`expiresAt`),
    PRIMARY KEY (`id`),
    CONSTRAINT `RefreshToken_userId_fkey`
      FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
      ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Announcement` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `authorName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdByUserId` VARCHAR(191) NOT NULL,

    INDEX `Announcement_createdByUserId_idx` (`createdByUserId`),
    INDEX `Announcement_createdAt_idx` (`createdAt`),
    INDEX `Announcement_title_idx` (`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `EventManagement` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NULL,
    `authorName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdByUserId` VARCHAR(191) NOT NULL,

    INDEX `EventManagement_createdByUserId_idx` (`createdByUserId`),
    INDEX `EventManagement_createdAt_idx` (`createdAt`),
    INDEX `EventManagement_startAt_idx` (`startAt`),
    INDEX `EventManagement_title_idx` (`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
