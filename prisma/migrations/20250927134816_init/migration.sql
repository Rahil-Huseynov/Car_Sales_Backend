-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" TEXT,
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
    "transmission" TEXT,
    "condition" TEXT,
    "color" TEXT,
    "location" TEXT,
    "city" TEXT,
    "description" TEXT,
    "features" TEXT[],
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
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
    "transmission" TEXT,
    "condition" TEXT,
    "color" TEXT,
    "location" TEXT,
    "city" TEXT,
    "description" TEXT,
    "features" TEXT[],
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "userCarId" INTEGER,
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
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "allCarsList_userCarId_key" ON "allCarsList"("userCarId");

-- AddForeignKey
ALTER TABLE "userJournal" ADD CONSTRAINT "userJournal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userJournal" ADD CONSTRAINT "userJournal_allCarsListId_fkey" FOREIGN KEY ("allCarsListId") REFERENCES "allCarsList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allCarsList" ADD CONSTRAINT "allCarsList_userCarId_fkey" FOREIGN KEY ("userCarId") REFERENCES "userJournal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allCarsList" ADD CONSTRAINT "allCarsList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carImages" ADD CONSTRAINT "carImages_allCarId_fkey" FOREIGN KEY ("allCarId") REFERENCES "allCarsList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carImages" ADD CONSTRAINT "carImages_userCarId_fkey" FOREIGN KEY ("userCarId") REFERENCES "userJournal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
