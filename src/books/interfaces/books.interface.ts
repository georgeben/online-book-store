import { Author } from '@/author/entities/author.entity';
import { Genre } from '../entities/genre.entity';
import { AuthorAttr } from '@/author/author.interface';

export interface GenreAttr {
  name: string;
}

export interface BookAttr {
  id: number;
  genres: GenreAttr[];
  authors: AuthorAttr[];
  price: number;
  qtyInStock: number;
}

export interface ICreateBook {
  title: string;
  genres: Genre[];
  authors: Author[];
  price: number;
  qtyInStock: number;
}
