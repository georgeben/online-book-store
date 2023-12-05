import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomerOrder } from '../entities/order.entity';
import { Transaction } from 'sequelize';
import { CustomerOrderItem } from '../entities/order-item.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(CustomerOrder)
    private readonly orderModel: typeof CustomerOrder,
    private sequelize: Sequelize,
  ) {}

  create(data, t: Transaction): Promise<CustomerOrder> {
    return this.orderModel.create(data, {
      transaction: t,
      include: [CustomerOrderItem],
    });
  }

  async listByCustomerId(customerId: number): Promise<CustomerOrder[]> {
    const orders = await this.orderModel.findAll({
      where: {
        customerId,
      },
      order: [['orderDate', 'DESC']],
    });
    return orders;
  }

  async getByCustomer(
    orderId: number,
    customerId: number,
    t: Transaction,
  ): Promise<CustomerOrder | null> {
    return this.orderModel.findOne({
      where: {
        customerId,
        id: orderId,
      },
      transaction: t,
    });
  }

  async runInTransaction(mutations) {
    return this.sequelize.transaction(async (t) => {
      const result = await mutations(t);
      return result;
    });
  }
}
