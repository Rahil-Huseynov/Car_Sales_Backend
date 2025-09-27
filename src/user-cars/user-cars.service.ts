import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserCarsService {
  constructor(private prisma: PrismaService) { }

  async createUserCar(data: {
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuel: string;
    transmission: string;
    condition: string;
    color: string;
    location: string;
    city: string;
    description: string;
    features: string[];
    name: string;
    phone: string;
    email: string;
    userId: number;
    imagesUrls?: string[];
  }) {
    const newUserCar = await this.prisma.userCars.create({
      data: {
        brand: data.brand,
        model: data.model,
        year: Number(data.year),
        price: Number(data.price),
        mileage: Number(data.mileage),
        fuel: data.fuel,
        transmission: data.transmission,
        condition: data.condition,
        color: data.color,
        city: data.city,
        description: data.description,
        features: data.features,
        name: data.name,
        phone: data.phone,
        email: data.email,
        userId: Number(data.userId),
        images: data.imagesUrls
          ? { create: data.imagesUrls.map((url) => ({ url })) }
          : undefined,
      },
      include: { images: true },
    })


    const newAllCar = await this.prisma.allCarsList.create({
      data: {
        brand: newUserCar.brand,
        model: newUserCar.model,
        year: newUserCar.year,
        price: newUserCar.price,
        mileage: newUserCar.mileage,
        fuel: newUserCar.fuel,
        transmission: newUserCar.transmission,
        condition: newUserCar.condition,
        color: newUserCar.color,
        location: newUserCar.location,
        city: newUserCar.city,
        description: newUserCar.description,
        features: newUserCar.features,
        name: newUserCar.name,
        phone: newUserCar.phone,
        email: newUserCar.email,
        userCarId: newUserCar.id,
        userId: newUserCar.userId,
        images: data.imagesUrls
          ? { create: data.imagesUrls.map((url) => ({ url })) }
          : undefined,
      },
      include: { images: true },
    });

    return { newUserCar, newAllCar };
  }

  async getAllUserCars() {
    return this.prisma.userCars.findMany({
      include: { images: true, allCar: { include: { images: true } } },
    });
  }

  async getUserCarById(id: number) {
    return this.prisma.userCars.findUnique({
      where: { id },
      include: { images: true, allCar: { include: { images: true } } },
    });
  }

  async updateUserCar(id: number, data: any) {
    const updatedUserCar = await this.prisma.userCars.update({
      where: { id },
      data: { ...data },
      include: { allCar: true, images: true },
    });

    if (updatedUserCar.allCar) {
      await this.prisma.allCarsList.update({
        where: { id: updatedUserCar.allCar.id },
        data: { ...data },
      });
    }

    return updatedUserCar;
  }

  async deleteUserCar(id: number) {
    const userCar = await this.prisma.userCars.findUnique({
      where: { id },
      include: { images: true, allCar: { include: { images: true } } },
    });

    if (!userCar) return null;

    await this.prisma.carimages.deleteMany({ where: { userCarId: id } });
    if (userCar.allCar) {
      await this.prisma.carimages.deleteMany({ where: { allCarId: userCar.allCar.id } });
      await this.prisma.allCarsList.delete({ where: { id: userCar.allCar.id } });
    }

    return this.prisma.userCars.delete({ where: { id } });
  }
}
