﻿CREATE TABLE `__EFMigrationsHistory` (
    `MigrationId` varchar(95) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
);

CREATE TABLE `Users` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Username` longtext NULL,
    `PasswordHash` longblob NULL,
    `PasswordSalt` longblob NULL,
    `Gender` longtext NULL,
    `DateOfBirth` datetime(6) NOT NULL,
    `KnownAs` longtext NULL,
    `Created` datetime(6) NOT NULL,
    `LastActive` datetime(6) NOT NULL,
    `Introduction` longtext NULL,
    `LookingFor` longtext NULL,
    `Interests` longtext NULL,
    `City` longtext NULL,
    `Country` longtext NULL,
    CONSTRAINT `PK_Users` PRIMARY KEY (`Id`)
);

CREATE TABLE `Values` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` longtext NULL,
    CONSTRAINT `PK_Values` PRIMARY KEY (`Id`)
);

CREATE TABLE `Likes` (
    `LikerID` int NOT NULL,
    `GeliketerID` int NOT NULL,
    CONSTRAINT `PK_Likes` PRIMARY KEY (`LikerID`, `GeliketerID`),
    CONSTRAINT `FK_Likes_Users_GeliketerID` FOREIGN KEY (`GeliketerID`) REFERENCES `Users` (`Id`) ON DELETE NO ACTION,
    CONSTRAINT `FK_Likes_Users_LikerID` FOREIGN KEY (`LikerID`) REFERENCES `Users` (`Id`) ON DELETE NO ACTION
);

CREATE TABLE `Messages` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `SenderId` int NOT NULL,
    `RecipientId` int NOT NULL,
    `Content` longtext NULL,
    `IsRead` bit NOT NULL,
    `DateRead` datetime(6) NULL,
    `MessageSent` datetime(6) NOT NULL,
    `SenderDeleted` bit NOT NULL,
    `RecipientDeleted` bit NOT NULL,
    CONSTRAINT `PK_Messages` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Messages_Users_RecipientId` FOREIGN KEY (`RecipientId`) REFERENCES `Users` (`Id`) ON DELETE NO ACTION,
    CONSTRAINT `FK_Messages_Users_SenderId` FOREIGN KEY (`SenderId`) REFERENCES `Users` (`Id`) ON DELETE NO ACTION
);

CREATE TABLE `Photos` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Url` longtext NULL,
    `Description` longtext NULL,
    `DateAdded` datetime(6) NOT NULL,
    `isMain` bit NOT NULL,
    `PublicId` longtext NULL,
    `UserId` int NOT NULL,
    CONSTRAINT `PK_Photos` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Photos_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

CREATE INDEX `IX_Likes_GeliketerID` ON `Likes` (`GeliketerID`);

CREATE INDEX `IX_Messages_RecipientId` ON `Messages` (`RecipientId`);

CREATE INDEX `IX_Messages_SenderId` ON `Messages` (`SenderId`);

CREATE INDEX `IX_Photos_UserId` ON `Photos` (`UserId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20190902173248_MySqlInit', '2.1.11-servicing-32099');

