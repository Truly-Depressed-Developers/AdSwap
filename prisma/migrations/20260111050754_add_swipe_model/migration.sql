-- CreateTable
CREATE TABLE "Swipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "swiperId" TEXT NOT NULL,
    "targetBusinessId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Swipe_swiperId_fkey" FOREIGN KEY ("swiperId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Swipe_targetBusinessId_fkey" FOREIGN KEY ("targetBusinessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Swipe_swiperId_idx" ON "Swipe"("swiperId");

-- CreateIndex
CREATE INDEX "Swipe_targetBusinessId_idx" ON "Swipe"("targetBusinessId");

-- CreateIndex
CREATE UNIQUE INDEX "Swipe_swiperId_targetBusinessId_key" ON "Swipe"("swiperId", "targetBusinessId");
