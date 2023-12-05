import { IsOptional, IsString } from 'class-validator';

export class ListBooksDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  genre?: string;
}
