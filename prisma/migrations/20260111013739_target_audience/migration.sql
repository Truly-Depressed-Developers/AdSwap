-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "website" TEXT,
    "nip" TEXT NOT NULL,
    "pkd" TEXT NOT NULL,
    "imageUrl" TEXT,
    "logoUrl" TEXT,
    "targetAudience" TEXT NOT NULL DEFAULT '',
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Business" ("address", "createdAt", "description", "id", "imageUrl", "latitude", "logoUrl", "longitude", "name", "nip", "ownerId", "pkd", "website") SELECT "address", "createdAt", "description", "id", "imageUrl", "latitude", "logoUrl", "longitude", "name", "nip", "ownerId", "pkd", "website" FROM "Business";
DROP TABLE "Business";
ALTER TABLE "new_Business" RENAME TO "Business";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
