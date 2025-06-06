import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/category.entity';
import { OrderProduct } from 'src/orderProduct/orderProduct.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constants';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @ApiProperty()
  price: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ type: String, nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ type: String, nullable: true })
  image: string | null;

  @Column({ default: false })
  @ApiProperty()
  featured: boolean;

  @ManyToOne(() => Category, (category) => category.products)
  @ApiProperty({ type: () => Category })
  category: Category;

  @OneToMany(() => OrderProduct, (op) => op.product)
  orderProducts: OrderProduct[];
  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;
  @CreateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
}
