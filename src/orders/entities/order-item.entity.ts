import {
  Column,
  ForeignKey,
  Table,
  Model,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  Unique,
  Min,
  DataType,
} from 'sequelize-typescript';
import { CustomerOrder } from './order.entity';
import { Book } from '@/books/entities/book.entity';

@Table({
  timestamps: true,
})
export class CustomerOrderItem extends Model<CustomerOrderItem> {
  @ForeignKey(() => CustomerOrder)
  @AllowNull(false)
  @Unique('unique_order_item')
  @Column
  orderId: number;

  @BelongsTo(() => CustomerOrder)
  order: CustomerOrder;

  @ForeignKey(() => Book)
  @AllowNull(false)
  @Unique('unique_order_item')
  @Column({
    references: {
      model: 'Books',
      key: 'id',
    },
  })
  bookId: number;

  @BelongsTo(() => Book, 'bookId')
  book: Book;

  @AllowNull(false)
  @Min(1)
  @Column
  quantity: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
    validate: {
      min: 0,
    },
  })
  unitPrice: number;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;
}
