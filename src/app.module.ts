import { BadRequestException, Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Product } from './products/product.entity';
import { Category } from './categories/category.entity';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { Order } from './orders/order.entity';
import { OrderProduct } from './orderProduct/orderProduct.entity';
import { OrdersModule } from './orders/orders.module';
import { OrderProductsModule } from './orderProduct/orderProducts.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    OrderProductsModule,
    StatsModule,
    // in app.module.ts or a shared module
    MulterModule.register({}),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.development`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          database: config.get<string>('DB_DATABASE'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          port: config.get<number>('DB_PORT'),
          host: 'localhost',
          type: 'postgres',
          synchronize: true, //process.env.NODE_ENV !== 'production', //development
          dropSchema: false, //process.env.NODE_ENV !== 'production', //development
          entities: [User, Product, Category, Order, OrderProduct],
          logging: false, //process.env.NODE_ENV !== 'production', //development,
        };
      },
    }),

    //
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
