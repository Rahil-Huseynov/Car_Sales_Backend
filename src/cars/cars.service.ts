import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type FilterOptions = {
  search?: string;
  status?: string;
  brand?: string;
  model?: string;
  year?: number;
  fuel?: string;
  transmission?: string;
  condition?: string;
  color?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
};

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  private getUploadsBase(): string {
    const base =
      (process.env.UPLOADS_BASE as string) ||
      (process.env.NEXT_PUBLIC_UPLOADS_BASE as string) ||
      '/uploads';
    return base.replace(/\/+$/, ''); 
  }

  private normalizeUrl(u: string | null | undefined): string {
    if (!u) return '/placeholder.svg';
    const s = String(u).trim();
    if (!s) return '/placeholder.svg';
    if (/^https?:\/\//i.test(s)) return s;
    const cleaned = s.replace(/^\/+/, '').replace(/^uploads\/+/i, '');
    const base = this.getUploadsBase();
    return `${base}/${cleaned}`;
  }

  async getAllCarsFromAllList(
    page = 1,
    limit = 20,
    filters: FilterOptions = {},
  ) {
    let pageNumber = Number(page) || 1;
    let limitNumber = Number(limit) || 20;
    const maxLimit = 100;
    if (limitNumber <= 0) limitNumber = 20;
    if (limitNumber > maxLimit) limitNumber = maxLimit;
    if (pageNumber <= 0) pageNumber = 1;

    const where: any = {};

    if (filters.status && filters.status !== 'all') where.status = filters.status;
    if (filters.brand && filters.brand !== 'all') where.brand = filters.brand;
    if (filters.model && filters.model !== 'all') where.model = filters.model;
    if (filters.fuel && filters.fuel !== 'all') where.fuel = filters.fuel;
    if (filters.transmission && filters.transmission !== 'all') where.transmission = filters.transmission;
    if (filters.condition && filters.condition !== 'all') where.condition = filters.condition;
    if (filters.color && filters.color !== 'all') where.color = filters.color;
    if (filters.city && filters.city !== 'all') where.city = filters.city;
    if (typeof filters.year === 'number' && !Number.isNaN(filters.year)) where.year = filters.year;

    if (typeof filters.minPrice === 'number' || typeof filters.maxPrice === 'number') {
      where.price = {};
      if (typeof filters.minPrice === 'number') where.price.gte = filters.minPrice;
      if (typeof filters.maxPrice === 'number') where.price.lte = filters.maxPrice;
    }

    if (filters.search && String(filters.search).trim() !== '') {
      const q = String(filters.search).trim();
      where.OR = [
        { brand: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    switch (filters.sortBy) {
      case 'price-low':
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'year-new':
      case 'year_desc':
        orderBy = { year: 'desc' };
        break;
      case 'year-old':
      case 'year_asc':
        orderBy = { year: 'asc' };
        break;
      case 'mileage-low':
        orderBy = { mileage: 'asc' };
        break;
      case 'mileage-high':
        orderBy = { mileage: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [rows, totalCount] = await this.prisma.$transaction([
      this.prisma.allCarsList.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy,
        include: { images: true, user: true },
      }),
      this.prisma.allCarsList.count({ where }),
    ]);

    const formatted = rows.map((car: any) => ({
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
        car.images?.map((img: any) => ({
          id: img.id,
          url: this.normalizeUrl(String(img.url ?? '')),
        })) ?? [],
    }));

    const totalPages = Math.max(1, Math.ceil((totalCount ?? 0) / limitNumber));
    if (pageNumber > totalPages) pageNumber = totalPages;

    return {
      cars: formatted,
      totalCount,
      totalPages,
      currentPage: pageNumber,
    };
  }

  async getPremiumCarsFromAllList(page = 1, limit = 20, filters: FilterOptions = {}) {
    const merged = { ...filters, status: 'premium' };
    return this.getAllCarsFromAllList(page, limit, merged);
  }
}
