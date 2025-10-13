import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';

interface AuthenticatedRequest extends Request {
  user: { id: number };
}

@Controller('favorites')
@UseGuards(JwtGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Post(':carId')
  async addFavorite(@Req() req: AuthenticatedRequest, @Param('carId') carId: string) {
    const userId = req.user.id;
    return this.favoritesService.addFavorite(userId, parseInt(carId));
  }

  @Delete(':id')
  async removeFavorite(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.id;
    const favoriteId = parseInt(id);
    return this.favoritesService.removeFavorite(userId, favoriteId);
  }

  @Get()
  async getFavorites(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.favoritesService.getFavorites(userId);
  }
}