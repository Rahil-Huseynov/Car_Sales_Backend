import { Injectable } from '@nestjs/common';
import * as data from './CarsData.json';

@Injectable()
export class CarsDataService {
  private readonly dataObj: Record<string, string[]>;

  constructor() {
    this.dataObj = data[0];
  }

  private paginateArray<T>(arr: T[], page = 1, limit = 10): T[] {
    const start = (page - 1) * limit;
    const end = start + limit;
    return arr.slice(start, end);
  }

  getAllDataSortedPaginated(page = 1, limit = 10): Record<string, string[]> {
    const sortedKeys = Object.keys(this.dataObj).sort((a, b) => a.localeCompare(b));
    const paginatedKeys = this.paginateArray(sortedKeys, page, limit);
    const sortedData: Record<string, string[]> = {};

    for (const key of paginatedKeys) {
      sortedData[key] = [...this.dataObj[key]].sort((a, b) => a.localeCompare(b));
    }

    return sortedData;
  }

  getAllKeysSortedPaginated(page = 1, limit = 10): string[] {
    const sortedKeys = Object.keys(this.dataObj).sort((a, b) => a.localeCompare(b));
    return this.paginateArray(sortedKeys, page, limit);
  }

  getAllValuesSortedPaginated(page = 1, limit = 10): string[] {
    const allValues = Object.values(this.dataObj).flat().sort((a, b) => a.localeCompare(b));
    return this.paginateArray(allValues, page, limit);
  }

  getValuesByKeyPaginated(key: string, page = 1, limit = 10): string[] {
    const values = this.dataObj[key] ? [...this.dataObj[key]].sort((a, b) => a.localeCompare(b)) : [];
    return this.paginateArray(values, page, limit);
  }
}
