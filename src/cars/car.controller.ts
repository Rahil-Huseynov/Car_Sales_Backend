import { Controller, Get, Query } from '@nestjs/common';
import { CarsService, FilterOptions } from './cars.service';

@Controller('car')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get('all')
  async getAllCars(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('brand') brand?: string,
    @Query('model') model?: string,
    @Query('year') year?: string,
    @Query('fuel') fuel?: string,
    @Query('transmission') transmission?: string,
    @Query('condition') condition?: string,
    @Query('color') color?: string,
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 20;

    const filters: FilterOptions = {
      search,
      status,
      brand,
      model,
      fuel,
      transmission,
      condition,
      color,
      city,
      sortBy,
      year: year ? parseInt(year, 10) : undefined,
      minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
    };

    return this.carsService.getAllCarsFromAllList(pageNumber, limitNumber, filters);
  }

  @Get('premium')
  async getPremiumCars(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search?: string,
    @Query('brand') brand?: string,
    @Query('model') model?: string,
    @Query('year') year?: string,
    @Query('fuel') fuel?: string,
    @Query('transmission') transmission?: string,
    @Query('condition') condition?: string,
    @Query('color') color?: string,
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 20;

    const filters: FilterOptions = {
      search,
      brand,
      model,
      fuel,
      transmission,
      condition,
      color,
      city,
      sortBy,
      year: year ? parseInt(year, 10) : undefined,
      minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
    };

    return this.carsService.getPremiumCarsFromAllList(pageNumber, limitNumber, filters);
  }
}
