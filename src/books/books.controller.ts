import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { CreateGenreDto } from './dto/create-genre.dto';
import { ListBooksDto } from './dto/list-books.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.booksService.create(createBookDto);
    return {
      message: 'Successfully created book',
      book,
    };
  }

  @Post('/genre')
  async createGenre(@Body() createGenreDto: CreateGenreDto) {
    const genre = await this.booksService.createGenre(createGenreDto);
    return {
      message: 'Successfully created genre',
      genre,
    };
  }

  @Get()
  async findAll(@Query() listBooksDto: ListBooksDto) {
    const books = await this.booksService.findAll(listBooksDto);
    return {
      message: 'Successfully listed books',
      books,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const book = await this.booksService.findOne(id);
    if (!book) {
      throw new NotFoundException('The book you specified was not found');
    }
    return {
      message: 'Successfully fetched book',
      book,
    };
  }
}
