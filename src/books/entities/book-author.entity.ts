import {
  Model,
  Column,
  Table,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';
import { Book } from '@/books/entities/book.entity';
import { Author } from '@/author/entities/author.entity';

// Sequelize sets a composite key (bookId,authorId )
@Table
export class BookAuthor extends Model<BookAuthor> {
  @AllowNull(false)
  @ForeignKey(() => Book)
  @Column
  bookId!: number;

  @AllowNull(false)
  @ForeignKey(() => Author)
  @Column
  authorId!: number;
}
