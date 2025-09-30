import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CarsService } from './cars.service';
import { CarsController } from './car.controller';
@Module({
  controllers: [CarsController],
  providers: [CarsService, PrismaService],
})
export class CarsModule {}
