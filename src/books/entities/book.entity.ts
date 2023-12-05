import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  BelongsToMany,
  DataType,
  Index,
  Min,
} from 'sequelize-typescript';
import { Genre } from './genre.entity';
import { BookGenre } from './book-genre.entity';
import { Author } from 'src/author/entities/author.entity';
import { BookAuthor } from './book-author.entity';

@Table({
  timestamps: true,
})
export class Book extends Model<Book> {
  @AllowNull(false)
  @Index
  @Column
  title: string;

  @BelongsToMany(() => Genre, () => BookGenre)
  genres?: Genre[];

  @BelongsToMany(() => Author, () => BookAuthor)
  authors: Author[];

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
    validate: {
      min: 0,
    },
  })
  price: number;

  @AllowNull(false)
  @Min(0)
  @Column
  qtyInStock: number;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;
}
