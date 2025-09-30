import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  async getAllCarsFromAllList(page = 1, limit = 10, search = '', status?: string, filters: any = {}) {
    let pageNumber = Number(page) || 1;
    let limitNumber = Number(limit) || 10;
    const maxLimit = 100;
    if (limitNumber <= 0) limitNumber = 10;
    if (limitNumber > maxLimit) limitNumber = maxLimit;
    if (pageNumber <= 0) pageNumber = 1;

    const where: any = {};
    if (status && status !== 'all') where.status = status;

    if (search && String(search).trim() !== '') {
      const q = String(search).trim();
      where.OR = [
        { brand: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (filters.brand && filters.brand !== 'all') where.brand = filters.brand;
    if (filters.model && filters.model !== 'all') where.model = filters.model;
    if (filters.year && filters.year !== 'all') where.year = Number(filters.year);
    if (filters.fuel && filters.fuel !== 'all') where.fuel = filters.fuel;
    if (filters.transmission && filters.transmission !== 'all') where.transmission = filters.transmission;
    if (filters.city && filters.city !== 'all') where.city = filters.city;
    if (filters.color && filters.color !== 'all') where.color = filters.color;

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = Number(filters.minPrice);
      if (filters.maxPrice) where.price.lte = Number(filters.maxPrice);
    }

    const totalCount = await this.prisma.allCarsList.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalCount / limitNumber));
    if (pageNumber > totalPages) pageNumber = totalPages;

    const skip = (pageNumber - 1) * limitNumber;

    let orderBy: any = { createdAt: 'desc' };
    if (filters.sortBy) {
      if (filters.sortBy === 'price_asc') orderBy = { price: 'asc' };
      else if (filters.sortBy === 'price_desc') orderBy = { price: 'desc' };
      else if (filters.sortBy === 'year_desc') orderBy = { year: 'desc' };
      else if (filters.sortBy === 'year_asc') orderBy = { year: 'asc' };
    }

    const cars = await this.prisma.allCarsList.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy,
      include: { images: true, user: true },
    });

    const UPLOADS_BASE =
      process.env.UPLOADS_BASE ||
      process.env.NEXT_PUBLIC_UPLOADS_BASE ||
      '/uploads/';
    const normalizeUrl = (u: string) => {
      if (!u) return '/placeholder.svg';
      if (/^https?:\/\//i.test(u)) return u;
      return `${UPLOADS_BASE.replace(/\/$/, '')}/${u.replace(/^\/+/, '')}`;
    };

    const formatted = cars.map((car) => ({
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      fuel: car.fuel,
      transmission: car.transmission,
      condition: car.condition,
      color: car.color,
      location: car.location,
      city: car.city,
      description: car.description,
      features: car.features ?? [],
      name: car.name,
      phone: car.phone,
      email: car.email,
      status: car.status,
      createdAt: car.createdAt,
      user: car.user
        ? {
            id: car.user.id,
            firstName: car.user.firstName,
            lastName: car.user.lastName,
            email: car.user.email,
            phoneNumber: car.user.phoneNumber,
          }
        : null,
      images:
        car.images?.map((img) => ({
          id: img.id,
          url: normalizeUrl(String(img.url ?? '')),
        })) ?? [],
    }));

    return { cars: formatted, totalCount, totalPages, currentPage: pageNumber };
  }
}
