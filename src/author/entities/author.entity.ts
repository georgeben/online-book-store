import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  BelongsToMany,
  Index,
} from 'sequelize-typescript';
import { Book } from 'src/books/entities/book.entity';
import { BookAuthor } from '../../books/entities/book-author.entity';

@Table({
  timestamps: true,
})
export class Author extends Model<Author> {
  @AllowNull(false)
  @Index
  @Column
  firstName: string;

  @AllowNull(false)
  @Index
  @Column
  lastName: string;

  @BelongsToMany(() => Book, () => BookAuthor)
  books?: Book[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
