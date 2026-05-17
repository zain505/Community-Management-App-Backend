CREATE TABLE `StoreFavorite` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `storeId` INTEGER NOT NULL,

    UNIQUE INDEX `StoreFavorite_userId_storeId_key`(`userId`, `storeId`),
    INDEX `StoreFavorite_userId_createdAt_idx`(`userId`, `createdAt`),
    INDEX `StoreFavorite_storeId_idx`(`storeId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `StoreFavorite_storeId_fkey`
      FOREIGN KEY (`storeId`) REFERENCES `Store` (`id`)
      ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
