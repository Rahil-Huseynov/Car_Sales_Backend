import { Controller, Get, Param, Body, Post, Put, Delete, BadRequestException } from '@nestjs/common';
import { UserCarsService } from './user-cars.service';

@Controller('user-cars')
export class UserCarsController {
  constructor(private readonly userCarsService: UserCarsService) {}

  @Post()
  async create(@Body() body: any) {
    return this.userCarsService.createUserCar(body);
  }

  @Get()
  async getAll() {
    return this.userCarsService.getAllUserCars();
  }

  @Get('recent')
  async getRecent() {
    return this.userCarsService.getRecentCars();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const carId = Number(id);
    if (Number.isNaN(carId)) throw new BadRequestException('Invalid car id');
    return this.userCarsService.getUserCarById(carId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.userCarsService.updateUserCar(Number(id), body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userCarsService.deleteUserCar(Number(id));
  }
}
