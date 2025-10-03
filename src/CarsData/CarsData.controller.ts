import { Controller, Get, Param, Query } from '@nestjs/common';
import { CarsDataService } from './CarsData.service';

@Controller('carsdata')
export class CarsDataController {
  constructor(private readonly CarsDataService: CarsDataService) { }

  @Get('all')
  getAllData(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.CarsDataService.getAllDataSortedPaginated(pageNum, limitNum);
  }

  @Get('keys')
  getAllKeys(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.CarsDataService.getAllKeysSortedPaginated(pageNum, limitNum);
  }

  @Get('values')
  getAllValues(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.CarsDataService.getAllValuesSortedPaginated(pageNum, limitNum);
  }

  @Get('brand/:key')
  getValuesByKey(
    @Param('key') key: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.CarsDataService.getValuesByKeyPaginated(key, pageNum, limitNum);
  }
}
