import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { AddItemToCartDto } from './dto/add-item-shopping-cart.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { LoggedInGuard } from 'src/auth/guards/logged-in.guard';
import { Customer } from 'src/users/entities/customer.entity';

@UseGuards(LoggedInGuard)
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Get()
  async findOne(@CurrentUser() currentUser: Customer) {
    const result = await this.shoppingCartService.findOne(currentUser.id);
    return {
      message: 'Successfully fetched cart',
      data: result,
    };
  }

  @Post('/items')
  async addItem(
    @CurrentUser() currentUser: Customer,
    @Body() addItemDto: AddItemToCartDto,
  ) {
    const result = await this.shoppingCartService.addItem(
      currentUser.id,
      addItemDto,
    );
    return {
      message: 'Successfully added item to shopping cart',
      data: result,
    };
  }

  @Delete('/items/:itemId')
  async removeItem(
    @CurrentUser() currentUser: Customer,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    const result = await this.shoppingCartService.removeItem(
      currentUser.id,
      itemId,
    );
    return {
      message: 'Successfully removed item from shopping cart',
      data: result,
    };
  }

  @Post('/checkout')
  async checkout(@CurrentUser() currentUser: Customer) {
    const result = await this.shoppingCartService.checkout(currentUser.id);
    return {
      message: 'Order placed successfully',
      result,
    };
  }
}
