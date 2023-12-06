import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { FindOptions, UpdateOptions } from 'sequelize';
import { Book } from '../entities/book.entity';
import { ICreateBook } from '../interfaces/books.interface';
import { Genre } from '../entities/genre.entity';
import { Author } from '@/author/entities/author.entity';

@Injectable()
export class BookRepository {
  constructor(@InjectModel(Book) private readonly bookModel: typeof Book) {}

  async create({
    title,
    price,
    qtyInStock,
    genres,
    authors,
  }: ICreateBook): Promise<Book> {
    const book = await this.bookModel.create({
      title,
      price,
      qtyInStock,
    });
    book.$set('authors', authors);
    book.$set('genres', genres);
    return book.save();
  }

  findAll(options: FindOptions<Book>): Promise<Book[]> {
    return this.bookModel.findAll(options);
  }

  findById(id: number): Promise<Book | null> {
    return this.bookModel.findByPk(id, {
      include: [
        { model: Genre, through: { attributes: [] } },
        { model: Author, through: { attributes: [] } },
      ],
    });
  }

  update(values, options: UpdateOptions) {
    return this.bookModel.update(values, options);
  }
}
