import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserCarsService } from './user-cars.service';
import { UserCarsController } from './user-cars.controller';

@Module({
  controllers: [UserCarsController],
  providers: [UserCarsService, PrismaService],
})
export class UserCarsModule {}
