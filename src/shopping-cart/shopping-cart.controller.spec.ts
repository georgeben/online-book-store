import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartRepository } from './repository/shopping-cart.repository';
import { BookRepository } from '@/books/repositories/books.repository';
import { OrdersService } from '@/orders/orders.service';

describe('ShoppingCartController', () => {
  let controller: ShoppingCartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingCartController],
      providers: [
        ShoppingCartService,
        {
          provide: ShoppingCartRepository,
          useValue: {},
        },
        {
          provide: BookRepository,
          useValue: {},
        },
        {
          provide: OrdersService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ShoppingCartController>(ShoppingCartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
