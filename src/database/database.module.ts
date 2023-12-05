import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Author } from 'src/author/entities/author.entity';
import { BookAuthor } from 'src/books/entities/book-author.entity';
import { BookGenre } from 'src/books/entities/book-genre.entity';
import { Book } from 'src/books/entities/book.entity';
import { Genre } from 'src/books/entities/genre.entity';
import { CustomerOrderItem } from 'src/orders/entities/order-item.entity';
import { CustomerOrder } from 'src/orders/entities/order.entity';
import { Payment } from 'src/orders/entities/payment.entity';
import { ShoppingCartItem } from 'src/shopping-cart/entities/shopping-cart-item.entity';
import { ShoppingCart } from 'src/shopping-cart/entities/shopping-cart.entity';
import { Customer } from 'src/users/entities/customer.entity';

const inDevelopment = process.env.NODE_ENV === 'development';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
        logging: inDevelopment,
        models: [
          Customer,
          Book,
          Genre,
          BookGenre,
          Author,
          BookAuthor,
          ShoppingCart,
          ShoppingCartItem,
          CustomerOrder,
          CustomerOrderItem,
          Payment,
        ],
        dialectOptions: {
          decimalNumbers: true,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
