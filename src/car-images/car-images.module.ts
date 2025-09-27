import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CarImagesService } from './car-images.service';
import { CarImagesController } from './car-images.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [CarImagesController],
  providers: [CarImagesService, PrismaService],
})
export class CarImagesModule {}
