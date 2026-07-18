CREATE TABLE "AdminUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Администратор',
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "News" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "coverImage" TEXT,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "NewsImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "newsId" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "NewsImage_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "CrewMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullname" TEXT NOT NULL,
    "vacancy" TEXT NOT NULL,
    "subVacancy" TEXT,
    "education" TEXT,
    "experience" TEXT,
    "achievements" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "photoImage" TEXT,
    "bannerImage" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "CrewImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "crewId" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CrewImage_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "CrewMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullnameApplicant" TEXT NOT NULL,
    "fullnameStudent" TEXT NOT NULL,
    "ageStudent" INTEGER NOT NULL,
    "contact" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "emailStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "emailError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "photoImage" TEXT,
    "fullname" TEXT NOT NULL,
    "vacancy" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE "HomeSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "urlVideo" TEXT
);

CREATE TABLE "HomeSlide" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "alt" TEXT,
    "image" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE INDEX "News_status_publishedAt_idx" ON "News"("status", "publishedAt");
CREATE INDEX "NewsImage_newsId_position_idx" ON "NewsImage"("newsId", "position");
CREATE INDEX "CrewMember_active_position_idx" ON "CrewMember"("active", "position");
CREATE INDEX "CrewImage_crewId_position_idx" ON "CrewImage"("crewId", "position");
CREATE INDEX "Application_status_createdAt_idx" ON "Application"("status", "createdAt");
CREATE INDEX "Contact_type_position_idx" ON "Contact"("type", "position");
CREATE INDEX "Review_active_position_idx" ON "Review"("active", "position");
CREATE INDEX "HomeSlide_active_position_idx" ON "HomeSlide"("active", "position");
