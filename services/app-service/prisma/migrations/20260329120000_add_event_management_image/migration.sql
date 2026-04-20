ALTER TABLE `EventManagement`
    ADD COLUMN `image` LONGTEXT NULL AFTER `description`;

UPDATE `EventManagement`
SET `image` = ''
WHERE `image` IS NULL;

ALTER TABLE `EventManagement`
    MODIFY `image` LONGTEXT NOT NULL;
