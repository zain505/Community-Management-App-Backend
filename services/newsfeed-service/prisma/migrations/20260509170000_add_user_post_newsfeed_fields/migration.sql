ALTER TABLE `NewsFeedItem`
    MODIFY `type` ENUM(
        'STORE_CREATED',
        'STORE_NAME_UPDATED',
        'STORE_LOCATION_UPDATED',
        'STORE_RATING_UPDATED',
        'STORE_IMAGE_UPDATED',
        'STORE_DELIVERY_UPDATED',
        'STORE_MIN_ORDER_UPDATED',
        'STORE_CONTACT_UPDATED',
        'STORE_PROFILE_UPDATED',
        'STORE_DELETED',
        'PRODUCT_ADDED',
        'PRODUCT_UPDATED',
        'PRODUCT_DELETED',
        'ANNOUNCEMENT_CREATED',
        'ANNOUNCEMENT_UPDATED',
        'ANNOUNCEMENT_DELETED',
        'EVENT_MANAGEMENT_CREATED',
        'EVENT_MANAGEMENT_UPDATED',
        'EVENT_MANAGEMENT_DELETED',
        'USER_POST',
        'POPULAR_STORE_CHANGED',
        'MOST_ACTIVE_STORE_CHANGED',
        'MOST_SEARCHED_STORE_CHANGED'
    ) NOT NULL,
    ADD COLUMN `source` ENUM('SYSTEM', 'USER_POST') NOT NULL DEFAULT 'SYSTEM' AFTER `type`,
    ADD COLUMN `approvalStatus` ENUM('PENDING', 'APPROVED', 'DISAPPROVED') NOT NULL DEFAULT 'APPROVED' AFTER `source`,
    ADD COLUMN `image` LONGTEXT NULL AFTER `description`,
    ADD COLUMN `authorUserId` VARCHAR(191) NULL AFTER `image`;

CREATE INDEX `NewsFeedItem_authorUserId_idx` ON `NewsFeedItem`(`authorUserId`);
CREATE INDEX `NewsFeedItem_approvalStatus_idx` ON `NewsFeedItem`(`approvalStatus`);
CREATE INDEX `NewsFeedItem_source_approvalStatus_createdAt_id_idx`
    ON `NewsFeedItem`(`source`, `approvalStatus`, `createdAt`, `id`);
