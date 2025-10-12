import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addFavorite(userId: number, carId: number) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_carId: { userId, carId } },
    });
    if (existing) {
      throw new ConflictException('Already favorited');
    }
    const car = await this.prisma.allCarsList.findUnique({ where: { id: carId } });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return this.prisma.favorite.create({
      data: { userId, carId },
      include: { car: true },
    });
  }

  async removeFavorite(userId: number, carId: number) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_carId: { userId, carId } },
    });
    if (!existing) {
      throw new NotFoundException('Favorite not found');
    }
    return this.prisma.favorite.delete({
      where: { id: existing.id },
    });
  }

  async getFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { car: true },
    });
  }
}