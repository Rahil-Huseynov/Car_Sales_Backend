-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "userName" TEXT,
    "userId" INTEGER,
    "userRole" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" TEXT,
    "phoneCode" TEXT,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userJournal" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "year" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "fuel" TEXT,
    "condition" TEXT,
    "color" TEXT,
    "viewcount" INTEGER NOT NULL DEFAULT 0,
    "ban" TEXT,
    "location" TEXT,
    "engine" TEXT,
    "gearbox" TEXT,
    "description" TEXT,
    "features" TEXT[],
    "status" TEXT,
    "userId" INTEGER NOT NULL,
    "allCarsListId" INTEGER,

    CONSTRAINT "userJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allCarsList" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "brand" TEXT,
    "model" TEXT,
    "year" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "fuel" TEXT,
    "condition" TEXT,
    "color" TEXT,
    "ban" TEXT,
    "viewcount" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT,
    "engine" TEXT,
    "gearbox" TEXT,
    "description" TEXT,
    "features" TEXT[],
    "status" TEXT,
    "userId" INTEGER,

    CONSTRAINT "allCarsList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carImages" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "allCarId" INTEGER,
    "userCarId" INTEGER,

    CONSTRAINT "carImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userJournal_allCarsListId_key" ON "userJournal"("allCarsListId");

-- AddForeignKey
ALTER TABLE "userJournal" ADD CONSTRAINT "userJournal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userJournal" ADD CONSTRAINT "userJournal_allCarsListId_fkey" FOREIGN KEY ("allCarsListId") REFERENCES "allCarsList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allCarsList" ADD CONSTRAINT "allCarsList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carImages" ADD CONSTRAINT "carImages_allCarId_fkey" FOREIGN KEY ("allCarId") REFERENCES "allCarsList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carImages" ADD CONSTRAINT "carImages_userCarId_fkey" FOREIGN KEY ("userCarId") REFERENCES "userJournal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
