import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from './orderProduct.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderProductsService {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
  ) {}

  public async createOrderProduct(
    orderId: string,
    productId: number,
    quantity: number,
    price: number,
  ): Promise<OrderProduct> {
    return await this.orderProductRepository.save({
      order: { id: orderId }, // references existing Order
      product: { id: productId }, // references existing Product
      quantity: quantity,
      price: price,
    });
  }
}
