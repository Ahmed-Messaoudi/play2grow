-- CreateTable
CREATE TABLE `Progress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `childId` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `gameType` VARCHAR(191) NOT NULL,
    `timeTaken` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Progress` ADD CONSTRAINT `Progress_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
