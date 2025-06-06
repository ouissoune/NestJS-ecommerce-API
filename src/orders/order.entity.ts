import { OrderProduct } from 'src/orderProduct/orderProduct.entity';
import { User } from 'src/users/user.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constants';
import { OrderStatus } from 'src/utils/enums';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @OneToMany(() => OrderProduct, (op) => op.order, { cascade: true })
  orderProducts: OrderProduct[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;
  @Column({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
}
