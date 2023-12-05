import {
  Model,
  Column,
  Table,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
} from 'sequelize-typescript';
import { Book } from './book.entity';
import { BookGenre } from './book-genre.entity';

@Table
export class Genre extends Model<Genre> {
  @PrimaryKey
  @Column
  name!: string;

  @BelongsToMany(() => Book, () => BookGenre)
  books: Book[];

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
