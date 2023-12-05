import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { LoggedInGuard } from 'src/auth/guards/logged-in.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Customer } from 'src/users/entities/customer.entity';
import { PayForOrderDto } from './dto/pay-for-order.dto';

@UseGuards(LoggedInGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/:orderId/pay')
  async pay(
    @CurrentUser() currentUser: Customer,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() payForOrderDto: PayForOrderDto,
  ) {
    const result = await this.ordersService.makePayment({
      customerId: currentUser.id,
      orderId,
      amountPaid: payForOrderDto.amountPaid,
    });
    return {
      message: 'Successfully made payment for order',
      data: result,
    };
  }

  @Get()
  async findAll(@CurrentUser() currentUser: Customer) {
    const result = await this.ordersService.findAll(currentUser.id);
    return {
      message: 'Successfully fetched order history',
      data: result,
    };
  }
}
