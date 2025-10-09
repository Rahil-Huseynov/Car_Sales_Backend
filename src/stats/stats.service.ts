import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [totalAllCars, totalUsers, soldAllCars] = await this.prisma.$transaction([
      this.prisma.allCarsList.count(),
      this.prisma.user.count(),
      this.prisma.allCarsList.count({ where: { status: 'sold' } }),
    ]);

    return {
      totalAllCars,
      totalUsers,
      soldAllCars,
    };
  }
}
