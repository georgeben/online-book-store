import { IsDefined, IsNumber, IsPositive } from 'class-validator';

export class PayForOrderDto {
  @IsDefined()
  @IsNumber()
  @IsPositive()
  amountPaid: number;
}
