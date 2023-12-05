import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { ShoppingCart } from '../entities/shopping-cart.entity';
import { ShoppingCartItem } from '../entities/shopping-cart-item.entity';
import { AddItemToCartDto } from '../dto/add-item-shopping-cart.dto';
import { Sequelize } from 'sequelize-typescript';
import { Book } from 'src/books/entities/book.entity';
import { Genre } from 'src/books/entities/genre.entity';
import { Author } from 'src/author/entities/author.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class ShoppingCartRepository {
  constructor(
    @InjectModel(ShoppingCart)
    private readonly shoppingCardModel: typeof ShoppingCart,
    @InjectModel(ShoppingCartItem)
    private readonly shoppingCartItemModel: typeof ShoppingCartItem,
    private sequelize: Sequelize,
  ) {}

  async runInTransaction(mutations) {
    return this.sequelize.transaction(async (t) => {
      const result = await mutations(t);
      return result;
    });
  }

  async getByUserId(
    customerId: number,
    t: Transaction = null,
  ): Promise<ShoppingCart> {
    const [cart] = await this.shoppingCardModel.findOrCreate({
      where: { customerId },
      defaults: {
        customerId,
      },
      include: [
        {
          model: ShoppingCartItem,
          include: [
            {
              model: Book,
              include: [
                { model: Genre, through: { attributes: [] } },
                { model: Author, through: { attributes: [] } },
              ],
            },
          ],
        },
      ],
      transaction: t,
    });
    return cart;
  }

  async addItem(
    cart: ShoppingCart,
    addItemToCartDto: AddItemToCartDto,
  ): Promise<void> {
    await this.sequelize.transaction(async (t) => {
      const [cartItem] = await this.shoppingCartItemModel.upsert(
        {
          cartId: cart.id,
          bookId: addItemToCartDto.bookId,
          quantity: addItemToCartDto.quantity,
        },
        { transaction: t },
      );

      return cartItem;
    });
  }

  clearItems(cartId: number, t: Transaction) {
    return this.shoppingCartItemModel.destroy({
      where: {
        cartId,
      },
      transaction: t,
    });
  }
}
