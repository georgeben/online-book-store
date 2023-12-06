import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreRepository } from './repositories/genre.repository';
import { AuthorService } from '@/author/author.service';
import { BookRepository } from './repositories/books.repository';
import { Genre } from './entities/genre.entity';
import { Book } from './entities/book.entity';
import { Author } from '@/author/entities/author.entity';
import { ListBooksDto } from './dto/list-books.dto';
import { Op } from 'sequelize';

@Injectable()
export class BooksService {
  constructor(
    private readonly genreRepository: GenreRepository,
    private readonly authorService: AuthorService,
    private readonly bookRepository: BookRepository,
  ) {}

  private async validateGenres(genres): Promise<Genre[]> {
    const found = await this.genreRepository.findAll({
      where: {
        name: genres,
      },
    });
    const invalid = genres.filter(
      (el) =>
        !found.some((item) => item.name.toLowerCase() === el.toLowerCase()),
    );
    if (invalid.length) {
      throw new BadRequestException(
        `The following genres are invalid: ${invalid}`,
      );
    }
    return found;
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const genres = await this.validateGenres(createBookDto.genres);
    const authors = await this.authorService.getMany(createBookDto.authors);

    const book = await this.bookRepository.create({
      title: createBookDto.title,
      genres,
      authors,
      price: createBookDto.price,
      qtyInStock: createBookDto.qtyInStock,
    });
    return book;
  }

  async createGenre(createGenreDto: CreateGenreDto) {
    const alreadyExists = await this.genreRepository.findByName(
      createGenreDto.name,
    );
    if (alreadyExists) {
      throw new ConflictException('This genre already exists');
    }
    return this.genreRepository.create(createGenreDto.name);
  }

  async findAll(listBooksDto: ListBooksDto) {
    const query: Record<string, any> = {};
    if (listBooksDto.title) {
      query.title = {
        [Op.like]: `%${listBooksDto.title}%`,
      };
    }

    let genreQuery = {};
    if (listBooksDto.genre) {
      genreQuery = { name: { [Op.like]: `%${listBooksDto.genre}%` } };
    }

    let authorQuery = {};
    if (listBooksDto.author) {
      authorQuery = {
        [Op.or]: [
          { firstName: { [Op.like]: `%${listBooksDto.author}%` } },
          { lastName: { [Op.like]: `%${listBooksDto.author}%` } },
        ],
      };
    }

    const result = await this.bookRepository.findAll({
      where: query,
      include: [
        {
          model: Genre,
          where: genreQuery,
          through: { attributes: [] },
        },
        { model: Author, where: authorQuery, through: { attributes: [] } },
      ],
    });
    return result;
  }

  findOne(id: number) {
    return this.bookRepository.findById(id);
  }
}
