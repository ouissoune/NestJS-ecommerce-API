import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateProductDto } from 'src/products/dtos/create-product.dto';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { UpdateProductDto } from './dtos/update-product.dto';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { diskStorage } from 'multer';
import { GetProductsQueryDto } from './dtos/get-products.dto';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { Product } from './product.entity';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Delete(':id')
  @Roles(UserType.ADMIN) // Only allow ADMIN users to delete products
  @UseGuards(AuthRolesGuard)
  public async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.getProductById(id);
    if (!product) {
      throw new BadRequestException(`Product with id ${id} not found`);
    }

    // Check if the product has an image and delete it from the filesystem

    return await this.productsService.deleteProductById(id);
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('image'))
  @Roles(UserType.ADMIN) // Only allow ADMIN users to upload product images
  @UseGuards(AuthRolesGuard)
  public async uploadProductImage(
    @Param('id', ParseIntPipe) productId: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.productsService.assignImageToProductById(
      productId,
      image.filename,
    );
  }

  @Put(':id/images')
  @Roles(UserType.ADMIN) // Only allow ADMIN users to upload product images
  @UseGuards(AuthRolesGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/product-images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}.${file.mimetype.split('/')[1]}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  public async updateProductImage(
    @Param('id', ParseIntPipe) productId: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.productsService.updateProductImageById(
      productId,
      image.filename,
    );
  }

  @Patch(':id')
  @Roles(UserType.ADMIN) // Only allow ADMIN users to update products
  @UseGuards(AuthRolesGuard)
  public async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() createProductDto: UpdateProductDto,
  ) {
    return await this.productsService.updateProductById(id, createProductDto);
  }

  @Delete(':id/images')
  @Roles(UserType.ADMIN) // Only allow ADMIN users to delete product images
  @UseGuards(AuthRolesGuard)
  public async deleteProductImage(
    @Param('id', ParseIntPipe) productId: number,
  ) {
    return await this.productsService.deleteProductImageById(productId);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of products' })
  public async GetProducts(@Query() getProductsQueryDto: GetProductsQueryDto) {
    return await this.productsService.GetFilteredProducts(
      getProductsQueryDto,
      undefined,
    );
  }
  @Post()
  @Roles(UserType.ADMIN) // Only allow ADMIN users to add products
  @UseGuards(AuthRolesGuard)
  @ApiResponse({
    status: 200,
    description: 'product saved successfully',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'request body validation failed',
  })
  @ApiOperation({ summary: 'save a product' })
  @ApiSecurity('Bearer')
  async addProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.addProduct(createProductDto);
  }

  @Get(':id')
  public async GetProductById(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.getProductById(id);
  }
}
