import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString({ each: true })
  @ArrayNotEmpty()
  genres: string[];

  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  authors: number[];

  @IsNumber({ allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(1)
  @IsNotEmpty()
  price: number;

  @IsNumber({ allowInfinity: false })
  @Min(1)
  @IsNotEmpty()
  qtyInStock: number;
}
