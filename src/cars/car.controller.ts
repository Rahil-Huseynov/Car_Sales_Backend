import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('car')
export class CarsController {
    constructor(private readonly carsService: CarsService) { }

    @Get('all')
    async getAllCars(
        @Query('page') page = '1',
        @Query('limit') limit = '100',
        @Query('search') search = '',
        @Query('status') status?: string,
    ) {
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 100;
        return this.carsService.getAllCarsFromAllList(pageNumber, limitNumber, search, status);
    }

    @Get('premium')
    async getPremiumCars() {
        return this.carsService.getPremiumCarsFromAllList();
    }

}
