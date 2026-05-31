-- AlterTable
ALTER TABLE `User`
    ADD COLUMN `usertype` INTEGER NOT NULL DEFAULT 2;

-- Backfill existing records so admin accounts remain correctly classified.
UPDATE `User`
SET `usertype` = 0
WHERE LOWER(`name`) REGEXP '(^|[[:space:]])super[[:space:]]+admin([[:space:]]|$)';

UPDATE `User`
SET `usertype` = 1
WHERE `usertype` = 2
  AND (
    `mobileNumber` = '+923000000000'
    OR LOWER(`name`) REGEXP '(^|[[:space:]])admin([[:space:]]|$)'
  );
