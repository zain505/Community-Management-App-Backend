ALTER TABLE `User`
    DROP INDEX `User_email_key`,
    CHANGE COLUMN `email` `mobileNumber` VARCHAR(191) NOT NULL,
    ADD UNIQUE INDEX `User_mobileNumber_key`(`mobileNumber`);
