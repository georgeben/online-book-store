import { InjectModel } from '@nestjs/sequelize';
import { Genre } from '../entities/genre.entity';
import { CreateGenreDto } from '../dto/create-genre.dto';
import { Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize';

@Injectable()
export class GenreRepository {
  constructor(@InjectModel(Genre) private readonly genreModel: typeof Genre) {}

  create(name: string): Promise<Genre> {
    return this.genreModel.create({ name }, { raw: true });
  }

  findByName(name): Promise<Genre | null> {
    return this.genreModel.findOne({ where: { name }, raw: true });
  }

  findAll(options: FindOptions<Genre>): Promise<Genre[]> {
    return this.genreModel.findAll(options);
  }
}
