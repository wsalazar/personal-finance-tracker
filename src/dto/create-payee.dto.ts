import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreatePayeeDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;

  @IsString()
  memo: string;

  @IsDate()
  date: Date;
}
