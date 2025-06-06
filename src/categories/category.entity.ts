import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Categories' })
export class Category {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty()
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
