import { ArrayNotEmpty, ValidateNested } from 'class-validator';
import { ProductInOrderType } from './create-order.dto';
import { Type } from 'class-transformer';

export class UpdateOrderProductsDto {
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => ProductInOrderType)
  orderProducts: ProductInOrderType[];
}
