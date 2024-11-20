import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreatePayeeDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsDate()
  date: Date;
}
