import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class CarImagesService {
  private readonly uploadDir: string;
  private readonly logger = new Logger(CarImagesService.name);

  constructor(private prisma: PrismaService) {
    this.uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
  }
  async addImages(userCarId: number, urls: string[]) {
    const id = Number(userCarId);
    if (Number.isNaN(id)) throw new BadRequestException('Invalid userCarId');

    const userCar = await this.prisma.userCars.findUnique({
      where: { id },
      include: { allCar: true },
    });

    if (!userCar) throw new BadRequestException('UserCar not found');

    const maxOrderResult = await this.prisma.carimages.aggregate({
      where: { userCarId: id },
      _max: { order: true },
    });
    const maxOrder = maxOrderResult._max.order ?? -1;
    const startOrder = maxOrder + 1;

    const created: Array<any> = [];

    for (let i = 0; i < urls.length; i++) {
      const record = await this.prisma.carimages.create({
        data: {
          url: urls[i],
          order: startOrder + i,
          userCarId: id,
          allCarId: userCar.allCar ? userCar.allCar.id : undefined,
        },
      });
      created.push(record);
    }

    return created;
  }

  async getImagesByUserCar(userCarId: number) {
    return this.prisma.carimages.findMany({ 
      where: { userCarId }, 
      orderBy: { order: 'asc' } 
    });
  }

  async deleteImage(id: number) {
    const image = await this.prisma.carimages.findUnique({ where: { id } });
    if (!image) throw new BadRequestException('Image not found');

    const url = image.url;
    if (url && !/^https?:\/\//i.test(url)) {
      const filePath = path.join(this.uploadDir, url);
      try {
        await fs.unlink(filePath);
      } catch (err: any) {
        if (err.code !== 'ENOENT') {
          this.logger.warn(`Failed to delete file ${filePath}: ${err?.message ?? err}`);
        }
      }
    }

    return this.prisma.carimages.delete({ where: { id } });
  }
}