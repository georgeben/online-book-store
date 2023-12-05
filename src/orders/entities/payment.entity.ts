import {
  AllowNull,
  Column,
  Model,
  Table,
  Min,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Customer } from 'src/users/entities/customer.entity';
import { CustomerOrder } from './order.entity';

@Table({ timestamps: true })
export class Payment extends Model<Payment> {
  @ForeignKey(() => Customer)
  @AllowNull(false)
  @Column
  customerId: number;

  @BelongsTo(() => Customer, 'customerId')
  customer: Customer;

  @ForeignKey(() => CustomerOrder)
  @AllowNull(false)
  @Column
  orderId: number;

  @BelongsTo(() => CustomerOrder, 'orderId')
  order: CustomerOrder;

  @AllowNull(false)
  @Min(0)
  @Column({
    type: DataType.DECIMAL(10, 2),
    validate: {
      min: 0,
    },
  })
  amountPaid: number;

  @AllowNull(false)
  @Column
  datePaid: Date;
}
