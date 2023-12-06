import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartRepository } from './repository/shopping-cart.repository';
import { BookRepository } from '@/books/repositories/books.repository';
import { OrdersService } from '@/orders/orders.service';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { ShoppingCartResponse } from './shopping-cart.interface';
import { AddItemToCartDto } from './dto/add-item-shopping-cart.dto';
import { NotFoundException } from '@nestjs/common';
import { ShoppingCartItem } from './entities/shopping-cart-item.entity';

describe('ShoppingCartService', () => {
  let shoppingCartService: ShoppingCartService;
  let shoppingCartRepository: ShoppingCartRepository;
  let bookRepository: BookRepository;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingCartService,
        {
          provide: ShoppingCartRepository,
          useValue: {
            getByUserId: jest.fn(),
            addItem: jest.fn(),
            clearItems: jest.fn(),
            runInTransaction: jest.fn(),
          },
        },
        {
          provide: BookRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: OrdersService,
          useValue: {
            calculateTotal: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    shoppingCartService = module.get<ShoppingCartService>(ShoppingCartService);
    shoppingCartRepository = module.get<ShoppingCartRepository>(
      ShoppingCartRepository,
    );
    bookRepository = module.get<BookRepository>(BookRepository);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(shoppingCartService).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a shopping cart by user ID', async () => {
      const customerId = 1;
      const cart = {
        id: 1,
        customerId,
        items: [],
      } as ShoppingCart;
      const total = 100;

      jest
        .spyOn(shoppingCartRepository, 'getByUserId')
        .mockResolvedValue(cart as any);

      jest.spyOn(ordersService, 'calculateTotal').mockReturnValue(total);

      const result: ShoppingCartResponse =
        await shoppingCartService.findOne(customerId);

      expect(shoppingCartRepository.getByUserId).toHaveBeenCalledWith(
        customerId,
      );
      expect(ordersService.calculateTotal).toHaveBeenCalledWith(cart.items);
      expect(result.cart).toEqual(cart);
      expect(result.total).toBe(total);
    });
  });

  describe('addItem', () => {
    it('should add an item to the shopping cart', async () => {
      const customerId = 1;
      const addItemToCartDto: AddItemToCartDto = {
        bookId: 1,
        quantity: 2,
      };
      const cart = {
        id: 1,
        customerId,
        items: [],
      };
      const book = {
        id: 1,
        qtyInStock: 5,
        price: 20,
      };

      jest
        .spyOn(shoppingCartRepository, 'getByUserId')
        .mockResolvedValue(cart as any);
      jest.spyOn(bookRepository, 'findById').mockResolvedValue(book as any);

      const result: ShoppingCartResponse = await shoppingCartService.addItem(
        customerId,
        addItemToCartDto,
      );

      expect(shoppingCartRepository.getByUserId).toHaveBeenCalledWith(
        customerId,
      );
      expect(bookRepository.findById).toHaveBeenCalledWith(
        addItemToCartDto.bookId,
      );
      expect(shoppingCartRepository.addItem).toHaveBeenCalledWith(
        cart,
        addItemToCartDto,
      );
      expect(result.cart).toEqual(cart);
    });

    it('should throw NotFoundException for a non-existing book', async () => {
      const userId = 1;
      const addItemToCartDto: AddItemToCartDto = {
        bookId: 1,
        quantity: 2,
      };

      jest.spyOn(shoppingCartRepository, 'getByUserId').mockResolvedValue({
        id: 1,
        customerId: 1,
        items: [],
      } as any);
      jest.spyOn(bookRepository, 'findById').mockReturnValue(null);

      await expect(
        shoppingCartService.addItem(userId, addItemToCartDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the shopping cart', async () => {
      const customerId = 1;
      const itemId = 1;
      const cart = {
        id: 1,
        customerId,
        items: [
          {
            id: 1,
            bookId: 1,
            quantity: 2,
            book: { id: 1, qtyInStock: 5, price: 20 },
          } as ShoppingCartItem,
        ],
      } as ShoppingCart;

      jest.spyOn(shoppingCartRepository, 'getByUserId').mockResolvedValue(cart);
      const destroyMock = jest.fn();
      const itemToRemove = { ...cart.items[0], destroy: destroyMock };

      jest.spyOn(cart.items, 'find').mockReturnValue(itemToRemove as any);

      const result: ShoppingCartResponse = await shoppingCartService.removeItem(
        customerId,
        itemId,
      );

      expect(shoppingCartRepository.getByUserId).toHaveBeenCalledWith(
        customerId,
      );
      expect(destroyMock).toHaveBeenCalled();
      expect(result.cart).toEqual(cart);
    });

    it('should throw NotFoundException for a non-existing item', async () => {
      const userId = 1;
      const itemId = 1;

      jest.spyOn(shoppingCartRepository, 'getByUserId').mockResolvedValue({
        id: 1,
        customerId: 1,
        items: [],
      } as any);

      await expect(
        shoppingCartService.removeItem(userId, itemId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkout', () => {
    it('should checkout and create an order', async () => {
      const customerId = 1;
      const cart = {
        id: 1,
        customerId: customerId,
        items: [
          {
            id: 1,
            bookId: 1,
            quantity: 2,
            book: { id: 1, qtyInStock: 5, price: 20 },
          } as ShoppingCartItem,
        ],
      } as ShoppingCart;

      const t = { session: 'george' }; // Mock transaction object
      jest
        .spyOn(shoppingCartRepository, 'runInTransaction')
        .mockImplementation(async (callback) => {
          return await callback(t);
        });

      jest.spyOn(shoppingCartRepository, 'getByUserId').mockResolvedValue(cart);

      const validateCartItemsSpy = jest.spyOn(
        shoppingCartService,
        'validateCartItems',
      );
      const orderServiceCreateSpy = jest.spyOn(ordersService, 'create');
      const shoppingCartRepositoryClearItemsSpy = jest.spyOn(
        shoppingCartRepository,
        'clearItems',
      );

      await shoppingCartService.checkout(customerId);

      expect(shoppingCartRepository.runInTransaction).toHaveBeenCalled();
      expect(shoppingCartRepository.getByUserId).toHaveBeenCalledWith(
        customerId,
        t,
      );
      expect(validateCartItemsSpy).toHaveBeenCalledWith(cart);
      expect(orderServiceCreateSpy).toHaveBeenCalledWith(
        {
          customerId,
          items: [{ bookId: 1, quantity: 2, unitPrice: 20 }],
        },
        t,
      );
      expect(shoppingCartRepositoryClearItemsSpy).toHaveBeenCalledWith(
        cart.id,
        t,
      );
    });
  });
});
