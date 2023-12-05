import { Injectable } from '@nestjs/common';
import { literal, Transaction } from 'sequelize';
import { BookRepository } from 'src/books/repositories/books.repository';
import { UpdateInventoryItem } from './inventory.interface';

@Injectable()
export class InventoryService {
  constructor(private readonly bookRepository: BookRepository) {}

  async update(items: UpdateInventoryItem[], t: Transaction): Promise<void> {
    const updateInventory = items.map((item) => {
      return this.bookRepository.update(
        {
          qtyInStock: literal(`qtyInStock + ${item.quantity}`),
        },
        {
          where: { id: item.itemId },
          transaction: t,
        },
      );
    });
    await Promise.all(updateInventory);
  }
}
