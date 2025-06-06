import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { ProductsModule } from 'src/products/products.module';
import { OrderProductsModule } from 'src/orderProduct/orderProducts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ProductsModule,
    OrderProductsModule,
    UsersModule,
  ],
  controllers: [OrderController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
