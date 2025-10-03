import { Module } from '@nestjs/common';
import { CarsDataController } from './CarsData.controller';
import { CarsDataService } from './CarsData.service';

@Module({
  controllers: [CarsDataController],
  providers: [CarsDataService],
})
export class CarsDataModule {}
