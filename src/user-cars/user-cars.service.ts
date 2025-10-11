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

  async createUserCar(data: any) {
    const imagesUrls: string[] | undefined = Array.isArray(data.imagesUrls)
      ? data.imagesUrls
      : typeof data.imagesUrls === 'string' && data.imagesUrls.length
      ? [data.imagesUrls]
      : undefined;

    const result = await this.prisma.$transaction(async (tx) => {
      const createdUserCar = await tx.userCars.create({
        data: {
          brand: data.brand,
          model: data.model,
          year: Number(data.year || 0),
          price: Number(data.price || 0),
          mileage: Number(data.mileage || 0),
          fuel: data.fuel,
          condition: data.condition,
          color: data.color,
          location: data.location,
          ban: data.ban,
          viewcount: data.viewcount ?? 0,
          engine: data.engine,
          gearbox: data.gearbox,
          description: data.description,
          features: data.features ?? [],
          status: data.status,
          userId: Number(data.userId),
          images: imagesUrls ? { create: imagesUrls.map((u) => ({ url: u })) } : undefined,
        },
        include: { images: true },
      });

      const createdAllCar = await tx.allCarsList.create({
        data: {
          brand: createdUserCar.brand,
          model: createdUserCar.model,
          year: createdUserCar.year,
          price: createdUserCar.price,
          mileage: createdUserCar.mileage,
          fuel: createdUserCar.fuel,
          condition: createdUserCar.condition,
          color: createdUserCar.color,
          location: createdUserCar.location,
          ban: createdUserCar.ban,
          viewcount: createdUserCar.viewcount ?? 0,
          engine: createdUserCar.engine,
          gearbox: createdUserCar.gearbox,
          description: createdUserCar.description,
          features: createdUserCar.features ?? [],
          status: createdUserCar.status,
          userCar: { connect: { id: createdUserCar.id } },
          userId: createdUserCar.userId,
          images: imagesUrls ? { create: imagesUrls.map((u) => ({ url: u })) } : undefined,
        },
        include: { images: true },
      });

      await tx.userCars.update({ where: { id: createdUserCar.id }, data: { allCarsListId: createdAllCar.id } });

      return { newUserCar: createdUserCar, newAllCar: createdAllCar };
    });

    return result;
  }

  async getAllUserCars() {
    return this.prisma.userCars.findMany({
      include: { images: true, allCar: { include: { images: true } } },
    });
  }

  async getUserCarById(id: number) {
    const car = await this.prisma.userCars.findUnique({
      where: { id },
      include: { images: true, allCar: { include: { images: true } }, user: true },
    });
    if (!car) return null;
    if (car.allCar) {
      const [updatedUserCar] = await this.prisma.$transaction([
        this.prisma.userCars.update({
          where: { id },
          data: { viewcount: { increment: 1 } },
          include: { images: true, allCar: { include: { images: true } }, user: true },
        }),
        this.prisma.allCarsList.update({
          where: { id: car.allCar.id },
          data: { viewcount: { increment: 1 } },
        }),
      ]);

      const normalizeUrl = (u: string | null | undefined) => (!u ? '/placeholder.svg' : String(u).replace(/^\/+/, ''));

      const images = (updatedUserCar.images ?? []).map((i) => ({ id: i.id, url: normalizeUrl(i.url) }));
      const allCar = updatedUserCar.allCar
        ? { ...updatedUserCar.allCar, images: (updatedUserCar.allCar.images ?? []).map((i) => ({ id: i.id, url: normalizeUrl(i.url) })) }
        : null;

      return {
        id: updatedUserCar.id,
        brand: updatedUserCar.brand,
        model: updatedUserCar.model,
        year: updatedUserCar.year,
        price: updatedUserCar.price,
        mileage: updatedUserCar.mileage,
        fuel: updatedUserCar.fuel,
        condition: updatedUserCar.condition,
        color: updatedUserCar.color,
        viewcount: updatedUserCar.viewcount,
        ban: updatedUserCar.ban,
        location: updatedUserCar.location,
        engine: updatedUserCar.engine,
        gearbox: updatedUserCar.gearbox,
        description: updatedUserCar.description,
        features: updatedUserCar.features,
        status: updatedUserCar.status,
        createdAt: updatedUserCar.createdAt,
        updatedAt: updatedUserCar.updatedAt,
        images,
        allCar,
        allCarsListId: updatedUserCar.allCarsListId ?? updatedUserCar.allCar?.id ?? null,
      };
    } else {
      const updatedUserCar = await this.prisma.userCars.update({
        where: { id },
        data: { viewcount: { increment: 1 } },
        include: { images: true, allCar: { include: { images: true } }, user: true },
      });

      const normalizeUrl = (u: string | null | undefined) => (!u ? '/placeholder.svg' : String(u).replace(/^\/+/, ''));

      const images = (updatedUserCar.images ?? []).map((i) => ({ id: i.id, url: normalizeUrl(i.url) }));
      const allCar = updatedUserCar.allCar
        ? { ...updatedUserCar.allCar, images: (updatedUserCar.allCar.images ?? []).map((i) => ({ id: i.id, url: normalizeUrl(i.url) })) }
        : null;

      return {
        id: updatedUserCar.id,
        brand: updatedUserCar.brand,
        model: updatedUserCar.model,
        year: updatedUserCar.year,
        price: updatedUserCar.price,
        mileage: updatedUserCar.mileage,
        fuel: updatedUserCar.fuel,
        condition: updatedUserCar.condition,
        color: updatedUserCar.color,
        viewcount: updatedUserCar.viewcount,
        ban: updatedUserCar.ban,
        location: updatedUserCar.location,
        engine: updatedUserCar.engine,
        gearbox: updatedUserCar.gearbox,
        description: updatedUserCar.description,
        features: updatedUserCar.features,
        status: updatedUserCar.status,
        createdAt: updatedUserCar.createdAt,
        updatedAt: updatedUserCar.updatedAt,
        images,
        allCar,
        allCarsListId: updatedUserCar.allCarsListId ?? updatedUserCar.allCar?.id ?? null,
      };
    }
  }

  async updateUserCar(id: number, data: any) {
    const userCar = await this.prisma.userCars.findUnique({
      where: { id },
      include: { allCar: true, images: true },
    });
    if (!userCar) throw new BadRequestException('UserCar not found');

    const allowedFields = [
      'brand', 'model', 'year', 'price', 'mileage', 'fuel', 'condition', 'color',
      'location', 'ban', 'engine', 'gearbox', 'description', 'features',
      'name', 'phone', 'phoneCode', 'status', 'email', 'userId',
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
        ops.push(this.prisma.carimages.create({
          data: { url, userCarId: id, allCarId: userCar.allCar ? userCar.allCar.id : undefined },
        }));
      }
    }

    if (userCar.allCar) {
      const allCarPayload: any = {};
      for (const k of Object.keys(updatePayload)) allCarPayload[k] = updatePayload[k];
      if (Object.keys(allCarPayload).length > 0) {
        ops.push(this.prisma.allCarsList.update({ where: { id: userCar.allCar.id }, data: allCarPayload }));
      }
    }

    if (Object.keys(updatePayload).length > 0) {
      ops.push(this.prisma.userCars.update({ where: { id }, data: updatePayload }));
    }

    if (ops.length === 0) {
      return this.prisma.userCars.findUnique({ where: { id }, include: { images: true, allCar: { include: { images: true } } } });
    }

    await this.prisma.$transaction(ops);
    return this.prisma.userCars.findUnique({ where: { id }, include: { images: true, allCar: { include: { images: true } } } });
  }

  async getRecentCars() {
    const cars = await this.prisma.userCars.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { images: true },
    });

    const normalizeUrl = (u: string | null | undefined) => (!u ? '/placeholder.svg' : String(u).replace(/^\/+/, ''));

    return cars.map((car) => ({
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      status: car.status,
      images: (car.images ?? []).map((i) => ({ id: i.id, url: normalizeUrl(i.url) })),
    }));
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
      ops.push(this.prisma.allCarsList.deleteMany({ where: { id: userCar.allCar.id } }));
    }

    ops.push(this.prisma.userCars.deleteMany({ where: { id } }));

    const results = await this.prisma.$transaction(ops);
    return results[results.length - 1];
  }

  async createAllCar(data: any) {
    const imagesUrls: string[] | undefined = Array.isArray(data.imagesUrls)
      ? data.imagesUrls
      : typeof data.imagesUrls === 'string' && data.imagesUrls.length
        ? [data.imagesUrls]
        : undefined;

    if (data.userId) {
      return this.prisma.$transaction(async (tx) => {
        const createdAll = await tx.allCarsList.create({
          data: {
            brand: data.brand,
            model: data.model,
            year: Number(data.year || 0),
            price: Number(data.price || 0),
            mileage: Number(data.mileage || 0),
            fuel: data.fuel,
            condition: data.condition,
            color: data.color,
            viewcount: data.viewcount ?? 0,
            location: data.location,
            ban: data.ban,
            engine: data.engine,
            gearbox: data.gearbox,
            description: data.description,
            features: data.features ?? [],
            status: data.status,
            userId: Number(data.userId),
            images: imagesUrls ? { create: imagesUrls.map((u) => ({ url: u })) } : undefined,
          },
          include: { images: true },
        });

        const createdUserCar = await tx.userCars.create({
          data: {
            brand: createdAll.brand,
            model: createdAll.model,
            year: createdAll.year,
            price: createdAll.price,
            mileage: createdAll.mileage,
            fuel: createdAll.fuel,
            condition: createdAll.condition,
            color: createdAll.color,
            viewcount: createdAll.viewcount ?? 0,
            location: createdAll.location,
            ban: createdAll.ban,
            engine: createdAll.engine,
            gearbox: createdAll.gearbox,
            description: createdAll.description,
            features: createdAll.features ?? [],
            status: createdAll.status,
            userId: createdAll.userId!,
            allCarsListId: createdAll.id,
            images: imagesUrls ? { create: imagesUrls.map((u) => ({ url: u })) } : undefined,
          },
          include: { images: true },
        });

        return { createdAll, createdUserCar };
      });
    } else {
      const createdAll = await this.prisma.allCarsList.create({
        data: {
          brand: data.brand,
          model: data.model,
          year: Number(data.year || 0),
          price: Number(data.price || 0),
          mileage: Number(data.mileage || 0),
          fuel: data.fuel,
          condition: data.condition,
          color: data.color,
          viewcount: data.viewcount ?? 0,
          location: data.location,
          ban: data.ban,
          engine: data.engine,
          gearbox: data.gearbox,
          description: data.description,
          features: data.features ?? [],
          status: data.status,
          images: imagesUrls ? { create: imagesUrls.map((u) => ({ url: u })) } : undefined,
        },
        include: { images: true },
      });

      return { createdAll };
    }
  }

  async getAllCars() {
    return this.prisma.allCarsList.findMany({ include: { images: true, userCar: { include: { images: true } } } });
  }

  async getAllCarById(id: number) {
    return this.prisma.allCarsList.findUnique({ where: { id }, include: { images: true, userCar: { include: { images: true } } } });
  }

  async updateAllCar(id: number, data: any) {
    const allCar = await this.prisma.allCarsList.findUnique({ where: { id }, include: { images: true, userCar: true } });
    if (!allCar) throw new BadRequestException('AllCar not found');

    const allowed = ['brand', 'model', 'year', 'price', 'mileage', 'fuel', 'condition', 'color', 'location', 'ban', 'engine', 'gearbox', 'description', 'features', 'status', 'userId'];
    const updatePayload: any = {};
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(data, k)) {
        let val = data[k];
        if (['year', 'price', 'mileage', 'userId'].includes(k) && val !== undefined && val !== '' && val !== null) {
          const n = Number(val);
          if (!Number.isNaN(n)) val = n;
          else val = undefined;
        }
        if (k === 'features' && val && !Array.isArray(val)) {
          try { val = typeof val === 'string' ? JSON.parse(val) : Array.from(val); } catch { val = Array.isArray(val) ? val : [val]; }
        }
        if (val !== undefined) updatePayload[k] = val;
      }
    }

    const imagesUrls: string[] | undefined = Array.isArray(data.imagesUrls)
      ? data.imagesUrls
      : typeof data.imagesUrls === 'string' && data.imagesUrls.length
        ? [data.imagesUrls]
        : undefined;

    const ops: Prisma.PrismaPromise<any>[] = [];

    if (imagesUrls && imagesUrls.length > 0) {
      ops.push(this.prisma.carimages.deleteMany({ where: { allCarId: id } }));
      if (allCar.userCar) {
        ops.push(this.prisma.carimages.deleteMany({ where: { userCarId: allCar.userCar.id } }));
      }
      for (const url of imagesUrls) {
        ops.push(this.prisma.carimages.create({ data: { url, allCarId: id, userCarId: allCar.userCar ? allCar.userCar.id : undefined } }));
      }
    }

    if (Object.keys(updatePayload).length > 0) {
      ops.push(this.prisma.allCarsList.update({ where: { id }, data: updatePayload }));
      if (allCar.userCar) {
        ops.push(this.prisma.userCars.update({ where: { id: allCar.userCar.id }, data: updatePayload }));
      }
    }

    if (ops.length === 0) {
      return this.prisma.allCarsList.findUnique({ where: { id }, include: { images: true, userCar: { include: { images: true } } } });
    }

    await this.prisma.$transaction(ops);
    return this.prisma.allCarsList.findUnique({ where: { id }, include: { images: true, userCar: { include: { images: true } } } });
  }

  async deleteAllCar(id: number) {
    const allCar = await this.prisma.allCarsList.findUnique({
      where: { id },
      include: { images: true, userCar: { include: { images: true } } },
    });
    if (!allCar) return null;

    const filenames: string[] = [
      ...(allCar.images ?? []).map((i) => i.url),
      ...(allCar.userCar?.images ?? []).map((i) => i.url),
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
    ops.push(this.prisma.carimages.deleteMany({ where: { allCarId: id } }));
    if (allCar.userCar) {
      ops.push(this.prisma.carimages.deleteMany({ where: { userCarId: allCar.userCar.id } }));
      ops.push(this.prisma.userCars.deleteMany({ where: { id: allCar.userCar.id } }));
    }
    ops.push(this.prisma.allCarsList.deleteMany({ where: { id } }));

    const results = await this.prisma.$transaction(ops);
    return results[results.length - 1];
  }
}
