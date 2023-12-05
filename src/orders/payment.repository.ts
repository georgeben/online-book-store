import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './entities/payment.entity';
import { CustomerOrder } from './entities/order.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment) private readonly paymentModel: typeof Payment,
  ) {}

  create(
    payload: { order: CustomerOrder; amountPaid: number },
    t: Transaction,
  ): Promise<Payment> {
    const { order, amountPaid } = payload;
    return this.paymentModel.create(
      {
        customerId: order.customerId,
        orderId: order.id,
        amountPaid,
        datePaid: new Date(),
      },
      { transaction: t },
    );
  }
}
