import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarImagesService {
  constructor(private prisma: PrismaService) {}

 async addImages(userCarId: number, urls: string[]) {
  return this.prisma.carimages.createMany({
    data: urls.map(url => ({
      url,
      userCarId: Number(userCarId),
    }))
  })
}


  async getImagesByUserCar(userCarId: number) {
    return this.prisma.carimages.findMany({ where: { userCarId } });
  }

  async deleteImage(id: number) {
    return this.prisma.carimages.delete({ where: { id } });
  }
}
