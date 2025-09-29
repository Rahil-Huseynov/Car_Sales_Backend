import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CarsController } from './car.controller';
import { CarsService } from './cars.service';
@Module({
  controllers: [CarsController],
  providers: [CarsService, PrismaService],
})
export class CarsModule {}
