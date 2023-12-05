import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCartRepository } from './repository/shopping-cart.repository';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { ShoppingCartItem } from './entities/shopping-cart-item.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { BooksModule } from 'src/books/books.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ShoppingCart, ShoppingCartItem]),
    BooksModule,
    OrdersModule,
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService, ShoppingCartRepository],
})
export class ShoppingCartModule {}
