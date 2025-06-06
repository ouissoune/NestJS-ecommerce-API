import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import {
  Between,
  FindOptionsWhere,
  FindOptionsWhereProperty,
  Like,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { UpdateProductDto } from './dtos/update-product.dto';
import { GetWhereClauseFromQuery } from './decorators/where-clause.decorator';
import { GetProductsQueryDto } from './dtos/get-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private categoryService: CategoriesService,
  ) {}

  public async getProductsCount() {
    return await this.productRepository.count();
  }

  public async addProduct(
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const { categoryId, ...productData } = createProductDto;
    const category = await this.categoryService.getProductById(categoryId);

    const product = this.productRepository.create({
      ...productData,
      category,
    });
    const newProduct = await this.productRepository.save(product);
    return newProduct;
  }

  public async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    return product;
  }

  public async checkIfProductCanBeDeleted(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { orderProducts: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    if (product.orderProducts.length > 0)
      throw new ConflictException(
        `Product with id ${id} cannot be deleted because it is associated with existing orders.`,
      );
    return product;
  }
  //fix it
  @GetWhereClauseFromQuery
  public async GetFilteredProducts(
    getProductsQueryDto: GetProductsQueryDto,
    where: FindOptionsWhere<Product> | undefined,
  ) {
    if (getProductsQueryDto.name) {
      return await this.productRepository.find({
        where: { name: Like(`%${getProductsQueryDto.name.toLowerCase()}%`) },
        take: getProductsQueryDto.size, // Limit the number of results
        skip:
          getProductsQueryDto.page && getProductsQueryDto.size
            ? (getProductsQueryDto.page - 1) * getProductsQueryDto.size
            : 0, // If page is not provided, skip 0 results
        relations: { category: true }, // Eager load the related 'category' entity
      });
    }
    return await this.productRepository.find({
      where, // Ensure 'where' is correctly defined
      take: getProductsQueryDto.size, // Limit the number of results
      skip:
        getProductsQueryDto.page && getProductsQueryDto.size
          ? (getProductsQueryDto.page - 1) * getProductsQueryDto.size
          : 0, // If page is not provided, skip 0 results
      relations: { category: true }, // Eager load the related 'category' entity
    });
  }

  public async assignImageToProductById(
    id: number,
    imageName: string,
  ): Promise<Product> {
    const product = await this.getProductById(id);

    product.image = imageName;
    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct;
  }

  public async deleteProductImageById(id: number) {
    const product = await this.getProductById(id);

    const imagePath = join(
      process.cwd(),
      'uploads',
      'product-images',
      product.image || '.png',
    );
    if (existsSync(imagePath)) {
      unlinkSync(imagePath);
    }
    product.image = null;
    return await this.productRepository.save(product);
  }
  public async updateProductImageById(
    id: number,
    imageName: string,
  ): Promise<Product> {
    const product = await this.getProductById(id);

    await this.deleteProductImageById(id);

    product.image = imageName;

    return await this.productRepository.save(product);
  }

  public async updateProductById(
    productId: number,
    productToSave: UpdateProductDto,
  ) {
    const product = await this.getProductById(productId);
    const { categoryId, ...productData } = productToSave;

    if (categoryId) {
      const category = await this.categoryService.getProductById(categoryId);
      product.category = category;
    }

    Object.assign(product, productData);

    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct;
  }

  public async deleteProductById(id: number): Promise<{ message: string }> {
    const product = await this.checkIfProductCanBeDeleted(id);

    if (product.image) await this.deleteProductImageById(product.id);
    await this.productRepository.remove(product);
    return {
      message: `Product with id ${id} deleted successfully`,
    };
  }
}
