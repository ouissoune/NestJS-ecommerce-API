import { Between, FindOptionsWhere } from 'typeorm';
import { Product } from '../product.entity';
import { GetProductsQueryDto } from '../dtos/get-products.dto';

export function GetWhereClauseFromQuery(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (this: any, ...args: any[]) {
    const where: FindOptionsWhere<Product> = {};
    const { featured, size, limit, page, categoryId, minPrice, maxPrice } =
      args[0] as GetProductsQueryDto;
    if (featured) {
      where.featured = featured;
    }

    if (categoryId) {
      where.category = { id: categoryId };
    }
    if (minPrice && maxPrice) {
      where.price = Between(minPrice, maxPrice);
    }

    return originalMethod.apply(this, args);
  };

  return descriptor;
}

export function GetWhereClauseFromQueryDto(
  target: any,
  methodName: string,
  paramIndex: number,
) {
  console.log(target);
  console.log(methodName);
}
