-- DropForeignKey
ALTER TABLE `Store` DROP FOREIGN KEY `Store_userId_fkey`;

-- DropIndex
DROP INDEX `Store_userId_key` ON `Store`;

-- RenameColumn
ALTER TABLE `Store` CHANGE COLUMN `userId` `ownerUserId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Store_ownerUserId_key` ON `Store`(`ownerUserId`);

-- DropTable
DROP TABLE `RefreshToken`;

-- DropTable
DROP TABLE `User`;
