import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { BooksModule } from '@/books/books.module';

@Module({
  imports: [BooksModule],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
