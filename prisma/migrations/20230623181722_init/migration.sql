-- CreateTable
CREATE TABLE "BoolDays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "days" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BoolRSVP" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "isBooling" BOOLEAN NOT NULL,
    "boolDate" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "HistoricBools" (
    "boolDate" TEXT NOT NULL PRIMARY KEY,
    "boolers" TEXT NOT NULL
);
