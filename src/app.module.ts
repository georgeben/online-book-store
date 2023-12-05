import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { AuthorModule } from './author/author.module';
import { RedisModule } from './redis/redis.module';
import { REDIS } from './redis/redis.constants';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { OrdersModule } from './orders/orders.module';
import { InventoryModule } from './inventory/inventory.module';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    BooksModule,
    AuthorModule,
    RedisModule,
    AuthModule,
    UsersModule,
    ShoppingCartModule,
    OrdersModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(
    @Inject(REDIS) private readonly redis,
    private readonly configService: ConfigService,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    const TWENTY_FOUR_HOURS = 48 * 60 * 60 * 1000;
    const sessionSecret = this.configService.get('SESSION_SECRET');
    const NODE_ENV = this.configService.get('NODE_ENV');
    const inDevelopment = NODE_ENV === 'development';

    consumer
      .apply(
        session({
          store: new RedisStore({ client: this.redis }),
          name: 'book-store-session',
          saveUninitialized: false,
          secret: sessionSecret,
          resave: false,
          rolling: true,
          cookie: {
            sameSite: true,
            httpOnly: true,
            maxAge: TWENTY_FOUR_HOURS,
            secure: !inDevelopment,
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
