import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { CustomerOrderItem } from '../entities/order-item.entity';
import { CreateOrderItem } from '../orders.interfaces';

@Injectable()
export class OrderItemRepository {
  constructor(
    @InjectModel(CustomerOrderItem)
    private readonly orderItemModel: typeof CustomerOrderItem,
  ) {}

  create(data: CreateOrderItem, t: Transaction) {
    return this.orderItemModel.create(data, { transaction: t });
  }
}
