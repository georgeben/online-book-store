import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as currency from 'currency.js';
import { Transaction } from 'sequelize';
import { OrderRepository } from './repositories/order.repository';
import { OrderItemRepository } from './repositories/order-item.repository';
import { CreateOrder } from './orders.interfaces';
import { ORDER_STATUS } from './order.constants';
import { InventoryService } from '@/inventory/inventory.service';
import { UpdateInventoryItem } from '@/inventory/inventory.interface';
import { CustomerOrder } from './entities/order.entity';
import { PaymentRepository } from './payment.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly inventoryService: InventoryService,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  calculateTotal(items: { quantity: number; unitPrice: number }[]): number {
    const total = items.reduce((acc, curr) => {
      const amount = currency(curr.unitPrice).multiply(curr.quantity);
      return amount.add(acc).value;
    }, 0);
    return total;
  }

  async create(createOrder: CreateOrder, t: Transaction) {
    // If user has a pending order tell the user to complete it first to prevent abuse
    const orderTotal = this.calculateTotal(createOrder.items);
    const order = await this.orderRepository.create(
      {
        customerId: createOrder.customerId,
        status: ORDER_STATUS.PENDING,
        totalAmount: orderTotal,
        orderDate: new Date(),
        items: createOrder.items,
      },
      t,
    );

    const inventoryUpdates: UpdateInventoryItem[] = order.items.map((el) => ({
      itemId: el.bookId,
      quantity: -el.quantity,
    }));
    await this.inventoryService.update(inventoryUpdates, t);

    return order;
  }

  async makePayment(payload: {
    customerId: number;
    orderId: number;
    amountPaid: number;
  }): Promise<CustomerOrder> {
    const { amountPaid } = payload;
    const result = await this.orderRepository.runInTransaction(async (t) => {
      const order = await this.orderRepository.getByCustomer(
        payload.orderId,
        payload.customerId,
        t,
      );
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      this.validateOrderPayment(order, amountPaid);
      await this.paymentRepository.create({ order, amountPaid }, t);

      order.set({ status: ORDER_STATUS.CONFIRMED });
      return order.save({ transaction: t });
    });

    return result;
  }

  validateOrderPayment(order: CustomerOrder, amountPaid: number) {
    if (order.status !== ORDER_STATUS.PENDING) {
      throw new ConflictException(
        `Cannot pay for order because order is ${order.status}`,
      );
    }
    if (order.totalAmount != amountPaid) {
      throw new ConflictException('Could not process order');
    }
  }

  findAll(customerId: number): Promise<CustomerOrder[]> {
    return this.orderRepository.listByCustomerId(customerId);
  }
}
