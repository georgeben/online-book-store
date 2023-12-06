import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AddItemToCartDto } from './dto/add-item-shopping-cart.dto';
import { ShoppingCartRepository } from './repository/shopping-cart.repository';
import { BookRepository } from '@/books/repositories/books.repository';
import { ShoppingCartItem } from './entities/shopping-cart-item.entity';
import { OrdersService } from '@/orders/orders.service';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { CustomerOrder } from '@/orders/entities/order.entity';
import { ShoppingCartResponse } from './shopping-cart.interface';

@Injectable()
export class ShoppingCartService {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartRepository,
    private readonly bookRepository: BookRepository,
    private readonly orderService: OrdersService,
  ) {}

  async findOne(userId: number): Promise<ShoppingCartResponse> {
    const cart = await this.shoppingCartRepository.getByUserId(userId);
    const total = await this.orderService.calculateTotal(
      cart.items.map((item) => ({
        quantity: item.quantity,
        unitPrice: item.book.price,
      })),
    );
    return {
      cart,
      total,
    };
  }

  async addItem(
    userId: number,
    addItemToCartDto: AddItemToCartDto,
  ): Promise<ShoppingCartResponse> {
    const cart = await this.shoppingCartRepository.getByUserId(userId);
    const book = await this.bookRepository.findById(addItemToCartDto.bookId);

    if (!book) {
      throw new NotFoundException('The book you specified was not found.');
    }
    const amountAvailable = book.qtyInStock;
    if (!amountAvailable) {
      throw new UnprocessableEntityException('Out of stock');
    }
    if (amountAvailable < addItemToCartDto.quantity) {
      throw new UnprocessableEntityException(
        `Only ${amountAvailable} copies are left`,
      );
    }
    await this.shoppingCartRepository.addItem(cart, addItemToCartDto);
    return this.findOne(userId);
  }

  async removeItem(
    userId: number,
    itemId: number,
  ): Promise<ShoppingCartResponse> {
    const cart = await this.shoppingCartRepository.getByUserId(userId);
    const itemToRemove = cart.items.find((el) => el.id == itemId);
    if (!itemToRemove) {
      throw new NotFoundException('The item you specified was not found');
    }
    await itemToRemove.destroy();
    return this.findOne(userId);
  }

  validateCartItems(cart: ShoppingCart) {
    if (!cart.items?.length) {
      throw new UnprocessableEntityException('Cart is empty');
    }
    const unavailableItem = cart.items.find(
      (item: ShoppingCartItem) => item.quantity > item.book.qtyInStock,
    );
    if (unavailableItem) {
      throw new UnprocessableEntityException(
        `${unavailableItem.book.title} is currently out of stock`,
      );
    }
  }

  async checkout(customerId: number): Promise<CustomerOrder> {
    const result = await this.shoppingCartRepository.runInTransaction(
      async (t) => {
        const cart = await this.shoppingCartRepository.getByUserId(
          customerId,
          t,
        );
        this.validateCartItems(cart);

        const order = await this.orderService.create(
          {
            customerId,
            items: cart.items.map((el) => ({
              bookId: el.bookId,
              quantity: el.quantity,
              unitPrice: el.book.price,
            })),
          },
          t,
        );
        await this.shoppingCartRepository.clearItems(cart.id, t);

        return order;
      },
    );
    return result;
  }
}
