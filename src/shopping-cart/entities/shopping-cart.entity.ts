import {
  Column,
  ForeignKey,
  Table,
  Model,
  HasMany,
} from 'sequelize-typescript';
import { Customer } from 'src/users/entities/customer.entity';
import { ShoppingCartItem } from './shopping-cart-item.entity';

@Table
export class ShoppingCart extends Model<ShoppingCart> {
  @ForeignKey(() => Customer)
  @Column
  customerId: number;

  @HasMany(() => ShoppingCartItem)
  items: ShoppingCartItem[];
}
