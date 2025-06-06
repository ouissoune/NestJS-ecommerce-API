import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus, Period } from 'src/utils/enums';

export class GetOrdersDto {
  @IsEnum(Period, { message: 'Invalid period' })
  period: Period;
  @IsEnum(OrderStatus, { message: 'Invalid order status' })
  @IsOptional()
  status?: OrderStatus;
}
