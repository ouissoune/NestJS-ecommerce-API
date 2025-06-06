import { Module } from '@nestjs/common';
import { OrderProductsService } from './orderProducts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from './orderProduct.entity';

@Module({
  providers: [OrderProductsService],
  exports: [OrderProductsService], // Exporting OrderProductsService to be used in other modules
  imports: [TypeOrmModule.forFeature([OrderProduct])], // No entities to import, but you can add TypeOrmModule if needed
})
export class OrderProductsModule {}
