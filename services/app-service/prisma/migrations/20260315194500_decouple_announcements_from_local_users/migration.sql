-- DropForeignKey
ALTER TABLE `Announcement` DROP FOREIGN KEY `Announcement_createdByUserId_fkey`;

-- AlterTable
ALTER TABLE `Announcement`
    ADD COLUMN `authorName` VARCHAR(191) NOT NULL DEFAULT 'Unknown User';

-- Backfill author names for existing rows that were created before the column existed.
UPDATE `Announcement` AS `announcement`
LEFT JOIN `User` AS `user`
  ON `user`.`id` = `announcement`.`createdByUserId`
SET `announcement`.`authorName` = COALESCE(`user`.`name`, `announcement`.`authorName`);
