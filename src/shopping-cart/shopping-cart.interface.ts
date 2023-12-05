import { BookAttr } from 'src/books/interfaces/books.interface';
import { ShoppingCart } from './entities/shopping-cart.entity';

export interface ShoppingCartItemAttr {
  cartId: number;
  bookId: number;
  book: BookAttr;
  quantity: number;
}

export interface ShoppingCartAttr {
  customerId: number;
  items: ShoppingCartItemAttr[];
  total: number;
}

export interface ShoppingCartResponse {
  cart: ShoppingCart;
  total: number;
}
