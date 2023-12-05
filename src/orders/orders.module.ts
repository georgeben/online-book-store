import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerOrder } from './entities/order.entity';
import { CustomerOrderItem } from './entities/order-item.entity';
import { OrderRepository } from './repositories/order.repository';
import { OrderItemRepository } from './repositories/order-item.repository';
import { InventoryModule } from 'src/inventory/inventory.module';
import { PaymentRepository } from './payment.repository';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([CustomerOrder, CustomerOrderItem, Payment]),
    InventoryModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderRepository,
    OrderItemRepository,
    PaymentRepository,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
