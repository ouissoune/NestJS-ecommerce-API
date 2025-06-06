import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductInOrderType)
  productsInOrder: ProductInOrderType[];
}

export class ProductInOrderType {
  @IsInt()
  @IsNotEmpty()
  productId: number;
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
