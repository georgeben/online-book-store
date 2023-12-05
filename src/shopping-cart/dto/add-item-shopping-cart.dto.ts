import { IsNumber, Min } from 'class-validator';

export class AddItemToCartDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}
