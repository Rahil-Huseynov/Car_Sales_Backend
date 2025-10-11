-- DropForeignKey
ALTER TABLE "userJournal" DROP CONSTRAINT "userJournal_allCarsListId_fkey";

-- AddForeignKey
ALTER TABLE "userJournal" ADD CONSTRAINT "userJournal_allCarsListId_fkey" FOREIGN KEY ("allCarsListId") REFERENCES "allCarsList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
