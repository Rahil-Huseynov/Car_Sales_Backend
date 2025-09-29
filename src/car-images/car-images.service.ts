import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarImagesService {
  constructor(private prisma: PrismaService) {}

  async addImages(userCarId: number, urls: string[]) {
    const id = Number(userCarId);
    if (Number.isNaN(id)) throw new BadRequestException('Invalid userCarId');

    const userCar = await this.prisma.userCars.findUnique({
      where: { id },
      include: { allCar: true },
    });

    if (!userCar) throw new BadRequestException('UserCar not found');

    const created: Array<any> = [];

    for (const url of urls) {
      const record = await this.prisma.carimages.create({
        data: {
          url,
          userCarId: id,
          allCarId: userCar.allCar ? userCar.allCar.id : undefined,
        },
      });
      created.push(record);
    }

    return created;
  }

  async getImagesByUserCar(userCarId: number) {
    return this.prisma.carimages.findMany({ where: { userCarId } });
  }

  async deleteImage(id: number) {
    return this.prisma.carimages.delete({ where: { id } });
  }
}
