-- tax-manager MySQL schema
-- Import this into the Hostinger database (phpMyAdmin -> select the database -> Import)
-- to pre-create the tables. Not strictly required: the app also creates them
-- automatically on first connection (lib/db.js calls sequelize.sync()).

CREATE TABLE IF NOT EXISTS `Invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `description` text,
  `imageUrl` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `bundesland` varchar(255) DEFAULT NULL,
  `vatRate` float DEFAULT NULL,
  `corporateTaxRate` float DEFAULT NULL,
  `companyLogo` varchar(500) DEFAULT NULL,
  `taxId` varchar(255) DEFAULT NULL,
  `vatId` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `currency` varchar(255) DEFAULT 'EUR',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
