import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserCarsService {
  private readonly uploadDir: string;
  private readonly logger = new Logger(UserCarsService.name);

  constructor(private prisma: PrismaService) {
    this.uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
  }
  async createUserCar(data: {
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuel: string;
    condition: string;
    color: string;
    location?: string;
    ban?: string;
    engine?: string;
    gearbox?: string;
    description?: string;
    features?: string[];
    name?: string;
    phone?: string;
    phoneCode?: string;
    status?: string;
    email?: string;
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
        condition: data.condition,
        color: data.color,
        location: data.location,
        ban: data.ban,
        engine: data.engine,
        gearbox: data.gearbox,
        description: data.description,
        features: data.features ?? [],
        status: data.status,
        userId: Number(data.userId),
        images: data.imagesUrls
          ? { create: data.imagesUrls.map((filename) => ({ url: filename })) }
          : undefined,
      },
      include: { images: true },
    });

    const newAllCar = await this.prisma.allCarsList.create({
      data: {
        brand: newUserCar.brand,
        model: newUserCar.model,
        year: newUserCar.year,
        price: newUserCar.price,
        mileage: newUserCar.mileage,
        fuel: newUserCar.fuel,
        condition: newUserCar.condition,
        color: newUserCar.color,
        location: newUserCar.location,
        ban: newUserCar.ban,
        engine: newUserCar.engine,
        gearbox: newUserCar.gearbox,
        description: newUserCar.description,
        features: newUserCar.features ?? [],
        status: newUserCar.status,
        userCar: { connect: { id: newUserCar.id } },
        userId: newUserCar.userId,
        images: data.imagesUrls
          ? { create: data.imagesUrls.map((filename) => ({ url: filename })) }
          : undefined,
      },
      include: { images: true },
    });

    await this.prisma.userCars.update({
      where: { id: newUserCar.id },
      data: { allCarsListId: newAllCar.id },
    });

    return { newUserCar, newAllCar };
  }

  async getAllUserCars() {
    return this.prisma.userCars.findMany({
      include: { images: true, allCar: { include: { images: true } } },
    });
  }

  async getUserCarById(id: number) {
    const car = await this.prisma.userCars.findUnique({
      where: { id },
      include: {
        images: true,
        allCar: {
          include: { images: true },
        },
      },
    });

    if (!car) return null;
    const normalizeUrl = (u: string | null | undefined) =>
      !u ? '/placeholder.svg' : String(u).replace(/^\/+/, '');
    const images = (car.images ?? []).map((i) => ({ id: i.id, url: normalizeUrl(i.url) }));
    const allCar = car.allCar
      ? {
        ...car.allCar,
        images: (car.allCar.images ?? []).map((i) => ({ id: i.id, url: normalizeUrl(i.url) })),
      }
      : null;

    return {
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      fuel: car.fuel,
      condition: car.condition,
      color: car.color,
      ban: car.ban,
      location: car.location,
      engine: car.engine,
      gearbox: car.gearbox,
      description: car.description,
      features: car.features,
      status: car.status,
      createdAt: car.createdAt,
      updatedAt: car.updatedAt,
      images,
      allCar,
      allCarsListId: car.allCarsListId ?? car.allCar?.id ?? null,
    };
  }

  async updateUserCar(id: number, data: any) {
    const userCar = await this.prisma.userCars.findUnique({
      where: { id },
      include: { allCar: true, images: true },
    });

    if (!userCar) {
      throw new BadRequestException('UserCar not found');
    }
    const allowedFields = [
      'brand',
      'model',
      'year',
      'price',
      'mileage',
      'fuel',
      'condition',
      'color',
      'location',
      'ban',
      'engine',
      'gearbox',
      'description',
      'features',
      'name',
      'phone',
      'phoneCode',
      'status',
      'email',
      'userId',
    ];

    const updatePayload: any = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        let val = data[key];
        if (['year', 'price', 'mileage', 'userId'].includes(key) && val !== undefined && val !== null && val !== '') {
          const n = Number(val);
          if (!Number.isNaN(n)) val = n;
          else val = undefined;
        }
        if (key === 'features' && val && !Array.isArray(val)) {
          try {
            val = typeof val === 'string' ? JSON.parse(val) : Array.from(val);
          } catch {
            val = Array.isArray(val) ? val : [val];
          }
        }
        if (val !== undefined) updatePayload[key] = val;
      }
    }

    const imagesUrls: string[] | undefined = Array.isArray(data.imagesUrls)
      ? data.imagesUrls
      : typeof data.imagesUrls === 'string' && data.imagesUrls.length
        ? [data.imagesUrls]
        : undefined;

    const ops: Prisma.PrismaPromise<any>[] = [];
    if (imagesUrls && imagesUrls.length > 0) {
      ops.push(this.prisma.carimages.deleteMany({ where: { userCarId: id } }));
      if (userCar.allCar) {
        ops.push(this.prisma.carimages.deleteMany({ where: { allCarId: userCar.allCar.id } }));
      }

      for (const url of imagesUrls) {
        ops.push(
          this.prisma.carimages.create({
            data: {
              url,
              userCarId: id,
              allCarId: userCar.allCar ? userCar.allCar.id : undefined,
            },
          }),
        );
      }
    }
    if (userCar.allCar) {
      const allCarPayload: any = {};
      for (const k of Object.keys(updatePayload)) {
        allCarPayload[k] = updatePayload[k];
      }
      if (Object.keys(allCarPayload).length > 0) {
        ops.push(
          this.prisma.allCarsList.update({
            where: { id: userCar.allCar.id },
            data: allCarPayload,
          }),
        );
      }
    }
    if (Object.keys(updatePayload).length > 0) {
      ops.push(
        this.prisma.userCars.update({
          where: { id },
          data: updatePayload,
        }),
      );
    }
    if (ops.length === 0) {
      return this.prisma.userCars.findUnique({
        where: { id },
        include: { images: true, allCar: { include: { images: true } } },
      });
    }

    await this.prisma.$transaction(ops);
    return this.prisma.userCars.findUnique({
      where: { id },
      include: { images: true, allCar: { include: { images: true } } },
    });
  }

  async deleteUserCar(id: number) {
    const userCar = await this.prisma.userCars.findUnique({
      where: { id },
      include: { images: true, allCar: { include: { images: true } } },
    });

    if (!userCar) return null;

    const filenames: string[] = [
      ...(userCar.images ?? []).map((i) => i.url),
      ...(userCar.allCar?.images ?? []).map((i) => i.url),
    ].filter(Boolean as any);

    for (const filename of filenames) {
      if (!filename) continue;
      if (/^https?:\/\//i.test(filename)) continue;
      const filePath = path.join(this.uploadDir, filename);
      try {
        await fs.unlink(filePath);
      } catch (err: any) {
        if (err.code !== 'ENOENT') {
          this.logger.warn(`Failed to delete file ${filePath}: ${err?.message ?? err}`);
        }
      }
    }

    const ops: Prisma.PrismaPromise<any>[] = [];

    ops.push(this.prisma.carimages.deleteMany({ where: { userCarId: id } }));

    if (userCar.allCar) {
      ops.push(this.prisma.carimages.deleteMany({ where: { allCarId: userCar.allCar.id } }));
      ops.push(this.prisma.allCarsList.delete({ where: { id: userCar.allCar.id } }));
    }

    ops.push(this.prisma.userCars.delete({ where: { id } }));

    const results = await this.prisma.$transaction(ops);
    return results[results.length - 1];
  }
}
