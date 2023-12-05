import {
  Column,
  ForeignKey,
  Table,
  Model,
  BelongsTo,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  Min,
  HasMany,
  Default,
  DataType,
} from 'sequelize-typescript';
import { Customer } from 'src/users/entities/customer.entity';
import { CustomerOrderItem } from './order-item.entity';
import { ORDER_STATUS } from '../order.constants';

@Table({
  timestamps: true,
})
export class CustomerOrder extends Model {
  @ForeignKey(() => Customer)
  @AllowNull(false)
  @Column
  customerId: number;

  @BelongsTo(() => Customer, 'customerId')
  customer: Customer;

  @Default(ORDER_STATUS.PENDING)
  @AllowNull(false)
  @Column
  status: string;

  @AllowNull(false)
  @Min(0)
  @Column({
    type: DataType.DECIMAL(10, 2),
    validate: {
      min: 0,
    },
  })
  totalAmount: number;

  @AllowNull(false)
  @Column
  orderDate: Date;

  @HasMany(() => CustomerOrderItem)
  items: CustomerOrderItem[];

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;
}
