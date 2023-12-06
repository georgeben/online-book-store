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
} from 'sequelize-typescript';
import { ShoppingCart } from './shopping-cart.entity';
import { Book } from '@/books/entities/book.entity';

@Table({
  timestamps: true,
})
export class ShoppingCartItem extends Model<ShoppingCartItem> {
  @ForeignKey(() => ShoppingCart)
  @AllowNull(false)
  @Unique('unique_cart_item')
  @Column
  cartId: number;

  @BelongsTo(() => ShoppingCart)
  cart: ShoppingCart;

  @ForeignKey(() => Book)
  @AllowNull(false)
  @Unique('unique_cart_item')
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

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;
}
