import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarsService {
    constructor(private prisma: PrismaService) { }
   
    async getAllCarsFromAllList(page = 1, limit = 100, search = '', status?: string) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status && status !== 'all') where.status = status;
        if (search && search.trim() !== '') {
            const q = search.trim();
            where.OR = [
                { brand: { contains: q, mode: 'insensitive' } },
                { model: { contains: q, mode: 'insensitive' } },
                { city: { contains: q, mode: 'insensitive' } },
                { location: { contains: q, mode: 'insensitive' } },
            ];
        }

        const [cars, totalCount] = await this.prisma.$transaction([
            this.prisma.allCarsList.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { images: true, user: true },
            }),
            this.prisma.allCarsList.count({ where }),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        const formatted = cars.map(car => ({
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
            images: car.images?.map(img => ({ id: img.id, url: `${img.url}` })) ?? [],
        }));

        return { cars: formatted, totalCount, totalPages, currentPage: page };
    }

    async getPremiumCarsFromAllList() {
        const premiumCars = await this.prisma.allCarsList.findMany({
            where: { status: 'premium' },
            include: { images: true, user: true },
            orderBy: { createdAt: 'desc' },
        });

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
            user: car.user
                ? {
                    id: car.user.id,
                    firstName: car.user.firstName,
                    lastName: car.user.lastName,
                    email: car.user.email,
                    phoneNumber: car.user.phoneNumber,
                }
                : null,
            images: car.images?.map(img => ({ id: img.id, url: `${img.url}` })) ?? [],
        }));
    }
}
