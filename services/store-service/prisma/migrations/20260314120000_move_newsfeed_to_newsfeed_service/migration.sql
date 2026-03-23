-- DropForeignKey
ALTER TABLE `NewsFeedItem` DROP FOREIGN KEY `NewsFeedItem_storeId_fkey`;

-- DropForeignKey
ALTER TABLE `NewsFeedMetricState` DROP FOREIGN KEY `NewsFeedMetricState_storeId_fkey`;

-- DropTable
DROP TABLE `NewsFeedMetricState`;

-- DropTable
DROP TABLE `NewsFeedItem`;
