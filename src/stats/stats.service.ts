import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [
      totalAllCars,
      totalUsers,
      soldAllCars,
      allCarsViewsResult,
      orphanUserCarsViewsResult,
    ] = await this.prisma.$transaction([
      this.prisma.allCarsList.count(),
      this.prisma.user.count(),
      this.prisma.allCarsList.count({ where: { status: 'sold' } }),
      this.prisma.allCarsList.aggregate({ _sum: { viewcount: true } }),
      this.prisma.userCars.aggregate({ where: { allCarsListId: null }, _sum: { viewcount: true } }),
    ]);

    const allCarsViews = allCarsViewsResult?._sum?.viewcount ?? 0;
    const orphanUserCarsViews = orphanUserCarsViewsResult?._sum?.viewcount ?? 0;
    const totalViews = allCarsViews + orphanUserCarsViews;

    return {
      totalAllCars,
      totalUsers,
      soldAllCars,
      totalViews,
      allCarsViews,
      orphanUserCarsViews,
    };
  }
}
