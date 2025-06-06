import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoriesModule,
    UsersModule,
    MulterModule,
  ], // Importing TypeOrmModule to use Product entity
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // Exporting ProductsService to be used in other modules
})
export class ProductsModule {}
