USE testPCDB

IF NOT EXISTS (SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA='dbo' AND TABLE_NAME='Users')
                BEGIN
    CREATE TABLE Users
    (
        Email VARCHAR(50) PRIMARY KEY NOT NULL,
        Password VARCHAR(100) NOT NULL,
        Firstname VARCHAR(20) NOT NULL,
        Lastname VARCHAR(20),
        Phone VARCHAR(10) NOT NULL,
        Address VARCHAR(255)
    )
END

IF NOT EXISTS (SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA='dbo' AND TABLE_NAME='Categories')
                BEGIN
    CREATE TABLE Categories
    (
        Id INT PRIMARY KEY IDENTITY NOT NULL,
        CatType VARCHAR(8) NOT NULL,
        CatSubType VARCHAR(255) NOT NULL,
        Cost VARCHAR(8) NOT NULL
    )
END


IF NOT EXISTS (SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA='dbo' AND TABLE_NAME='Transactions')
                BEGIN
    CREATE TABLE Transactions
    (
        TransactionId VARCHAR(20) PRIMARY KEY NOT NULL,
        Email VARCHAR(50) FOREIGN KEY REFERENCES Users(Email),
        TransactionTime DATETIME DEFAULT GETDATE(),
        Amount VARCHAR(8) NOT NULL,
        TransactionStatus VARCHAR(20) NOT NULL
    )
END

IF NOT EXISTS (SELECT *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA='dbo' AND TABLE_NAME='Tickets')
BEGIN
    CREATE TABLE Tickets
    (
        IssueId VARCHAR(30) PRIMARY KEY NOT NULL,
        Email VARCHAR(50) FOREIGN KEY REFERENCES Users(Email),
        IssueDesc VARCHAR(255) NOT NULL,
        IssueDate DATETIME NOT NULL DEFAULT GETDATE(),
        IssueStatus VARCHAR(25) NOT NULL DEFAULT 'Issued. In Review',
        ETA DATE DEFAULT NULL,
        IssueType INT FOREIGN KEY REFERENCES Categories(Id),
        Rating INT,
        Review VARCHAR(255),
        --TransactionId VARCHAR(20) FOREIGN KEY REFERENCES Transactions(TransactionId),
        Comments VARCHAR(255)
    )
END             