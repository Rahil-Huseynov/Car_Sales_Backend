import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type FilterOptions = {
    search?: string;
    status?: string;
    brand?: string;
    model?: string;
    year?: number;
    fuel?: string;
    transmission?: string;
    color?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number
    limit?: number
    condition?: string
};

@Injectable()
export class CarsService {
    constructor(private prisma: PrismaService) { }


    async getAllCarsFromAllList(page = 1, limit = 12, filters: FilterOptions = {}) {
        let pageNumber = Number(page) || 1;
        let limitNumber = Number(limit) || 12;
        const maxLimit = 100;
        if (limitNumber <= 0) limitNumber = 12;
        if (limitNumber > maxLimit) limitNumber = maxLimit;
        if (pageNumber <= 0) pageNumber = 1;

        const where: any = {};

        if (filters.status && filters.status !== "all") where.status = filters.status;
        if (filters.brand && filters.brand !== "all") where.brand = filters.brand;
        if (filters.model && filters.model !== "all") where.model = filters.model;
        if (filters.fuel && filters.fuel !== "all") where.fuel = filters.fuel;
        if (filters.transmission && filters.transmission !== "all") where.transmission = filters.transmission;
        if (filters.condition && filters.condition !== "all") where.condition = filters.condition;
        if (filters.color && filters.color !== "all") where.color = filters.color;
        if (filters.city && filters.city !== "all") where.city = filters.city;
        if (typeof filters.year === "number" && !Number.isNaN(filters.year)) where.year = filters.year;

        if (typeof filters.minPrice === "number" || typeof filters.maxPrice === "number") {
            where.price = {};
            if (typeof filters.minPrice === "number") where.price.gte = filters.minPrice;
            if (typeof filters.maxPrice === "number") where.price.lte = filters.maxPrice;
        }

        // Axtarış
        if (filters.search) {
            where.OR = [
                { brand: { contains: filters.search, mode: "insensitive" } },
                { model: { contains: filters.search, mode: "insensitive" } },
                { city: { contains: filters.search, mode: "insensitive" } },
            ];
        }

        let orderBy: any = { createdAt: "desc" };
        switch (filters.sortBy) {
            case "price-low":
                orderBy = { price: "asc" };
                break;
            case "price-high":
                orderBy = { price: "desc" };
                break;
            case "year-new":
                orderBy = { year: "desc" };
                break;
            case "year-old":
                orderBy = { year: "asc" };
                break;
            case "mileage-low":
                orderBy = { mileage: "asc" };
                break;
            case "mileage-high":
                orderBy = { mileage: "desc" };
                break;
            default:
                orderBy = { createdAt: "desc" };
        }

        const [cars, totalCount] = await this.prisma.$transaction([
            this.prisma.allCarsList.findMany({
                where,
                skip: (pageNumber - 1) * limitNumber,
                take: limitNumber,
                orderBy,
                include: {
                    images: true,
                },
            }),
            this.prisma.allCarsList.count({ where }),
        ]);

        return {
            cars,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber,
        };
    }


    async getPremiumCarsFromAllList() {
        const premiumCars = await this.prisma.allCarsList.findMany({
            where: { status: 'premium' },
            include: { images: true, user: true },
            orderBy: { createdAt: 'desc' },
        });

        const UPLOADS_BASE =
            (process.env.UPLOADS_BASE as string) ||
            (process.env.NEXT_PUBLIC_UPLOADS_BASE as string) ||
            '/uploads/';
        const normalizeUrl = (u: string) => {
            if (!u) return '/placeholder.svg';
            if (/^https?:\/\//i.test(u)) return u;
            return `${UPLOADS_BASE.replace(/\/$/, '')}/${u.replace(/^\/+/, '')}`;
        };

        return premiumCars.map(car => ({
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
            status: car.status,
            createdAt: car.createdAt,
            user: car.user ? {
                id: car.user.id,
                firstName: car.user.firstName,
                lastName: car.user.lastName,
                email: car.user.email,
                phoneNumber: car.user.phoneNumber,
            } : null,
            images: car.images?.map(img => ({ id: img.id, url: normalizeUrl(String(img.url ?? '')) })) ?? [],
        }));
    }
}
