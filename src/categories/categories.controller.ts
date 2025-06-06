import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { Category } from './category.entity';

import { CreateCategoryDto } from './dtos/create-category.dto';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { CategoriesService } from './categories.service';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(UserType.ADMIN) // Only allow ADMIN users to create categories
  @UseGuards(AuthRolesGuard) // Ensure the user is authenticated
  async createCategory(@Body() category: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.createCategory(category);
  }

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return await this.categoriesService.getAllCategories();
  }
}
