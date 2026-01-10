/*
  Warnings:

  - You are about to drop the column `pricePerDay` on the `Adspace` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Adspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxWidth" INTEGER NOT NULL,
    "maxHeight" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isBarterAvailable" BOOLEAN NOT NULL DEFAULT false,
    "pricePerWeek" REAL,
    "inUse" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Adspace_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Adspace_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AdspaceType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Adspace" ("businessId", "createdAt", "description", "id", "imageUrl", "inUse", "isBarterAvailable", "maxHeight", "maxWidth", "name", "typeId") SELECT "businessId", "createdAt", "description", "id", "imageUrl", "inUse", "isBarterAvailable", "maxHeight", "maxWidth", "name", "typeId" FROM "Adspace";
DROP TABLE "Adspace";
ALTER TABLE "new_Adspace" RENAME TO "Adspace";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
