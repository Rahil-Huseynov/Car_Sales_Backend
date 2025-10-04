import { Injectable } from '@nestjs/common';
import * as data from './CarsData.json';

type PaginatedResult<T> = {
  items: T[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
};

@Injectable()
export class CarsDataService {
  private readonly dataObj: Record<string, string[]>;

  constructor() {
    this.dataObj = (data && data[0]) || {};
  }

  private paginateArray<T>(arr: T[], page = 1, limit = 10): PaginatedResult<T> {
    const totalCount = arr.length;
    const totalPages = totalCount === 0 ? 1 : Math.max(1, Math.ceil(totalCount / limit));
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = arr.slice(start, end);
    return { items, totalCount, totalPages, page, limit };
  }

  private matchesSearch(value: string, search?: string): boolean {
    if (!search || search.trim() === '') return true;
    return value.toLowerCase().includes(search.trim().toLowerCase());
  }

  getAllDataSortedPaginated(
    page = 1,
    limit = 10,
    search?: string,
  ): { items: Record<string, string[]>; totalCount: number; totalPages: number; page: number; limit: number } {
    const sortedKeys = Object.keys(this.dataObj).sort((a, b) => a.localeCompare(b));

    if (search && search.trim() !== '') {
      const matchedKeys = sortedKeys.filter((k) => this.matchesSearch(k, search));
      const itemsObj: Record<string, string[]> = {};
      matchedKeys.forEach((k) => {
        itemsObj[k] = [...(this.dataObj[k] || [])].sort((a, b) => a.localeCompare(b));
      });
      return {
        items: itemsObj,
        totalCount: matchedKeys.length,
        totalPages: 1,
        page: 1,
        limit: matchedKeys.length,
      };
    }

    const pag = this.paginateArray(sortedKeys, page, limit);
    const itemsObj: Record<string, string[]> = {};
    for (const key of pag.items) {
      itemsObj[key] = [...(this.dataObj[key] || [])].sort((a, b) => a.localeCompare(b));
    }
    return {
      items: itemsObj,
      totalCount: pag.totalCount,
      totalPages: pag.totalPages,
      page: pag.page,
      limit: pag.limit,
    };
  }

  getAllKeysSortedPaginated(page = 1, limit = 10, search?: string): PaginatedResult<string> {
    const sortedKeys = Object.keys(this.dataObj).sort((a, b) => a.localeCompare(b));
    if (search && search.trim() !== '') {
      const matched = sortedKeys.filter((k) => this.matchesSearch(k, search));
      return {
        items: matched,
        totalCount: matched.length,
        totalPages: 1,
        page: 1,
        limit: matched.length,
      };
    }
    return this.paginateArray(sortedKeys, page, limit);
  }
  getAllValuesSortedPaginated(page = 1, limit = 10, search?: string): PaginatedResult<string> {
    const allValues = Object.values(this.dataObj).flat();
    const unique = Array.from(new Set(allValues));
    const sorted = unique.sort((a, b) => a.localeCompare(b));

    if (search && search.trim() !== '') {
      const matched = sorted.filter((v) => this.matchesSearch(v, search));
      return {
        items: matched,
        totalCount: matched.length,
        totalPages: 1,
        page: 1,
        limit: matched.length,
      };
    }

    return this.paginateArray(sorted, page, limit);
  }

  getValuesByKeyPaginated(key: string, page = 1, limit = 10, search?: string): PaginatedResult<string> {
    const raw = this.dataObj[key] || [];
    const sorted = [...raw].sort((a, b) => a.localeCompare(b));

    if (search && search.trim() !== '') {
      const matched = sorted.filter((v) => this.matchesSearch(v, search));
      return {
        items: matched,
        totalCount: matched.length,
        totalPages: 1,
        page: 1,
        limit: matched.length,
      };
    }

    return this.paginateArray(sorted, page, limit);
  }
}
