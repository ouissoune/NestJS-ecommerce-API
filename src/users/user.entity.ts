import { Order } from 'src/orders/order.entity';
import { CURRENT_TIMESTAMP } from 'src/utils/constants';
import { UserType } from 'src/utils/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 150, nullable: true })
  username: string;
  @Column({ type: 'varchar', length: 250, unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ type: 'enum', default: UserType.NORMAL_USER, enum: UserType })
  userType: UserType;
  @Column({ default: false })
  isAccountVerified: boolean;

  @ManyToOne(() => Order, (order) => order.user)
  orders: Order[];
  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;
  @CreateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
}
