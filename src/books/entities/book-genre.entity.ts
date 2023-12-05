import {
  Model,
  Column,
  Table,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';
import { Book } from './book.entity';
import { Genre } from './genre.entity';

@Table
export class BookGenre extends Model<BookGenre> {
  @AllowNull(false)
  @ForeignKey(() => Book)
  @Column
  bookId!: number;

  @AllowNull(false)
  @ForeignKey(() => Genre)
  @Column
  genre!: string;
}
