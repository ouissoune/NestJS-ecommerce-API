import { GetStatsDto } from './dtos/get-stats.dto';
import { Injectable } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { OrderStatus, Period } from 'src/utils/enums';

@Injectable()
export class StatsService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  public async getStats(getStatsDto: GetStatsDto) {
    const totalProducts = await this.productsService.getProductsCount();
    const totalRevenue = await this.ordersService.calculateLifeTimeRevenue();
    let deliveredOrdersCount = 0;
    let pendingOrdersCount = 0;
    let processingOrdersCount = 0;
    switch (getStatsDto.period) {
      case Period.TODAY:
        deliveredOrdersCount =
          await this.ordersService.getCountOrdersForThisDay(
            OrderStatus.DELIVERED,
          );
        pendingOrdersCount = await this.ordersService.getCountOrdersForThisDay(
          OrderStatus.PENDING,
        );
        processingOrdersCount =
          await this.ordersService.getCountOrdersForThisDay(
            OrderStatus.PROCESSING,
          );
        break;
      case Period.THIS_MONTH:
        deliveredOrdersCount =
          await this.ordersService.getCountOrdersForThisMonth(
            OrderStatus.DELIVERED,
          );
        pendingOrdersCount =
          await this.ordersService.getCountOrdersForThisMonth(
            OrderStatus.PENDING,
          );
        processingOrdersCount =
          await this.ordersService.getCountOrdersForThisMonth(
            OrderStatus.PROCESSING,
          );
        break;
      case Period.THIS_YEAR:
        deliveredOrdersCount =
          await this.ordersService.getCountOrdersForThisYear(
            OrderStatus.DELIVERED,
          );
        pendingOrdersCount = await this.ordersService.getCountOrdersForThisYear(
          OrderStatus.PENDING,
        );
        processingOrdersCount =
          await this.ordersService.getCountOrdersForThisYear(
            OrderStatus.PROCESSING,
          );
        break;
      default:
        throw new Error('Invalid period specified');
    }
    return {
      totalProducts,
      totalRevenue,
      deliveredOrdersCount,
      pendingOrdersCount,
      processingOrdersCount,
    };
  }
}
