import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { GenreRepository } from './repositories/genre.repository';
import { Genre } from './entities/genre.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './entities/book.entity';
import { AuthorModule } from '@/author/author.module';
import { BookRepository } from './repositories/books.repository';

@Module({
  imports: [SequelizeModule.forFeature([Genre, Book]), AuthorModule],
  controllers: [BooksController],
  providers: [BooksService, GenreRepository, BookRepository],
  exports: [BookRepository],
})
export class BooksModule {}
