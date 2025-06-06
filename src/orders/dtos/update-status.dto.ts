import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/utils/enums';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message: `Status must be one of the following: ${Object.values(OrderStatus).join(', ')}`,
  })
  status: OrderStatus;
}
