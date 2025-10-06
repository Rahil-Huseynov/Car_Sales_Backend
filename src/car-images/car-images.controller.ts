import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CarImagesService } from './car-images.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('car-images')
export class CarImagesController {
  constructor(private readonly carImagesService: CarImagesService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('userCarId') userCarId: number,
  ) {
    const urls = files.map((file) => file.filename);
    return this.carImagesService.addImages(userCarId, urls);
  }

  @Get(':userCarId')
  async getImages(@Param('userCarId') userCarId: string) {
    return this.carImagesService.getImagesByUserCar(Number(userCarId));
  }

  @Delete(':id')
  async deleteImage(@Param('id') id: string) {
    return this.carImagesService.deleteImage(Number(id));
  }
}
