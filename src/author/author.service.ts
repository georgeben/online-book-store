import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './entities/author.entity';
import { AuthorRepository } from './author.repository';

@Injectable()
export class AuthorService {
  constructor(private authorRepository: AuthorRepository) {}

  async create(createAuthorDto: CreateAuthorDto) {
    return this.authorRepository.create(createAuthorDto);
  }

  async getMany(ids: number[]): Promise<Author[]> {
    const authors = await this.authorRepository.findAll({
      where: {
        id: ids,
      },
    });
    const invalid = ids.filter((el) => !authors.some((item) => item.id === el));
    if (invalid.length) {
      throw new BadRequestException(
        `The following author ids are invalid: ${invalid}`,
      );
    }
    return authors;
  }
}
