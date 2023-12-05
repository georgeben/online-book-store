import { InjectModel } from '@nestjs/sequelize';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FindOptions } from 'sequelize';

export class AuthorRepository {
  constructor(
    @InjectModel(Author) private readonly authorModel: typeof Author,
  ) {}

  create(author: CreateAuthorDto): Promise<Author> {
    return this.authorModel.create(author);
  }

  findAll(options: FindOptions<Author>): Promise<Author[]> {
    return this.authorModel.findAll(options);
  }
}
