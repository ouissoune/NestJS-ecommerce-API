import { UpdateOrderStatusDto } from './dtos/update-status.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { OrderProductsService } from 'src/orderProduct/orderProducts.service';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { OrderStatus, Period, UserType } from 'src/utils/enums';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderProduct } from 'src/orderProduct/orderProduct.entity';
import { JWTPayloadType } from 'src/utils/types';
import { UpdateOrderProductsDto } from './dtos/update-products.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly orderProductService: OrderProductsService,
    private readonly productsService: ProductsService,
  ) {}

  public async getCountOrdersForThisDay(orderStatus: OrderStatus) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const orders = await this.orderRepository.count({
      where: {
        status: orderStatus,
        createdAt: MoreThanOrEqual(today),
      },
    });
    return orders;
  }

  public async getCountOrdersForThisMonth(orderStatus: OrderStatus) {
    const today = new Date();
    today.setDate(1);
    today.setHours(0, 0, 0, 0);
    const orders = await this.orderRepository.count({
      where: {
        status: orderStatus,
        createdAt: MoreThanOrEqual(today),
      },
    });
    return orders;
  }

  public async getCountOrdersForThisYear(orderStatus: OrderStatus) {
    const today = new Date();
    today.setMonth(0);
    today.setDate(1);
    today.setHours(0, 0, 0, 0);
    const orders = await this.orderRepository.count({
      where: {
        status: orderStatus,
        createdAt: MoreThanOrEqual(today),
      },
    });
    return orders;
  }

  public async getOrderById(id: string, user: JWTPayloadType): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { user: true, orderProducts: { product: { category: true } } },
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    if (user.userType === UserType.NORMAL_USER && order.user.id !== user.id) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }
  public async getFilteredOrders(
    getOrdersQuery: GetOrdersDto,
    user: JWTPayloadType,
  ): Promise<Order[]> {
    const date: Date = new Date();
    switch (getOrdersQuery.period) {
      case Period.TODAY:
        date.setHours(0, 0, 0, 0);
        date.setMilliseconds(-1);
        break;
      case Period.THIS_MONTH:
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        date.setMilliseconds(-1);
        break;
      case Period.THIS_YEAR:
        date.setMonth(0);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        date.setMilliseconds(-1);
        break;
    }
    if (user.userType === UserType.NORMAL_USER)
      return await this.orderRepository.find({
        where: {
          user: { id: user.id },
          status: getOrdersQuery.status,
          createdAt: MoreThan(date),
        },
        relations: {
          user: true,
          orderProducts: {
            product: {
              category: true,
            },
          },
        },
      });
    const orders = await this.orderRepository.find({
      where: {
        status: getOrdersQuery.status,
        createdAt: MoreThan(date),
      },
      select: {
        id: true,
        user: true,
        orderProducts: {
          product: {
            id: true,
            name: true,
            price: true,
            category: { name: true },
            description: true,
            image: true,
            featured: true,
          },
          quantity: true,
        },
        totalPrice: true,
        createdAt: true,
        status: true,
      },
      relations: {
        user: true,
        orderProducts: {
          product: true,
        },
      },
    });

    return orders;
  }

  public async createOrder(
    createOrderDto: CreateOrderDto, // Replace with actual DTO type
    userId: number,
  ): Promise<Order> {
    const queryRunner =
      this.orderRepository.manager.connection.createQueryRunner();

    // Start a transaction
    await queryRunner.startTransaction();

    try {
      // Create the new order
      const order = this.orderRepository.create({ user: { id: userId } });
      order.orderProducts = [];
      let totalPrice = 0;

      // Process each product in the order
      for (const item of createOrderDto.productsInOrder) {
        // Get the product from the database
        const product = await this.productsService.getProductById(
          item.productId,
        );

        // Check if the requested quantity is available
        if (product.quantity < item.quantity) {
          throw new ConflictException(
            `Remaining Quantity of ${product.name} is ${product.quantity}, You asked for ${item.quantity}`,
          );
        }

        // Create the order product and set its values
        const orderProduct = new OrderProduct();
        orderProduct.product = product;
        orderProduct.quantity = item.quantity;
        orderProduct.price = product.price * item.quantity;

        totalPrice += orderProduct.price;

        // Add the order product to the order's products list
        order.orderProducts.push(orderProduct);

        // Optionally, reduce the quantity of the product (if you want to manage inventory)
        product.quantity -= item.quantity;
        await queryRunner.manager.save(product); // Update product quantity in the same transaction
      }

      // Set the total price for the order
      order.totalPrice = totalPrice;

      // Save the order in the database
      await queryRunner.manager.save(order);

      // Commit the transaction
      await queryRunner.commitTransaction();

      return order; // Return the created order
    } catch (error) {
      // If there's an error, rollback the transaction
      await queryRunner.rollbackTransaction();
      throw error; // Rethrow the error to be handled by the caller
    } finally {
      // Release the query runner after transaction is complete
      await queryRunner.release();
    }
  }

  public async getUserOrders(userId: number): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
    });
    return orders;
  }

  public async calculateLifeTimeRevenue() {
    return await this.orderRepository.sum('totalPrice');
  }

  public async updateOrderStatusById(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { user: true, orderProducts: { product: { category: true } } },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    order.status = updateOrderStatusDto.status;

    return await this.orderRepository.save(order);
  }

  public async updateOrderProductsById(
    orderProductsDto: UpdateOrderProductsDto,
    orderId: string,
  ) {
    const queryRunner =
      this.orderRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const order = await this.getOrderById(orderId, {
        id: 0,
        userType: UserType.ADMIN,
      });
      order.orderProducts = [];
      let totalPrice = 0;

      for (const orderProduct of orderProductsDto.orderProducts) {
        const product = await this.productsService.getProductById(
          orderProduct.productId,
        );
        if (orderProduct.quantity > product.quantity)
          throw new ConflictException(
            `Remaining Quantity of ${product.name} is ${product.quantity},You asked for ${orderProduct.quantity}`,
          );

        const newOrderProduct = new OrderProduct();
        newOrderProduct.product = product;
        newOrderProduct.quantity = orderProduct.quantity;
        newOrderProduct.price = product.price * orderProduct.quantity;
        totalPrice += newOrderProduct.price;
        order.orderProducts.push(newOrderProduct);
      }
      order.totalPrice = totalPrice;
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
