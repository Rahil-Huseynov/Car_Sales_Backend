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
  getAllKeys(@Query('page') page: string, @Query('limit') limit: string, @Query('search') search?: string,) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.CarsDataService.getAllKeysSortedPaginated(pageNum, limitNum, search);
  }

  @Get('values')
  getAllValues(@Query('page') page: string, @Query('limit') limit: string, @Query('search') search?: string,) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.CarsDataService.getAllValuesSortedPaginated(pageNum, limitNum, search);
  }

  @Get('brand/:key')
  getValuesByKey(
    @Param('key') key: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.CarsDataService.getValuesByKeyPaginated(key, pageNum, limitNum, search);
  }
}
