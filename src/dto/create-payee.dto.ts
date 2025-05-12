import { IsDate, IsNumber, isString, IsString } from 'class-validator';

export class CreatePayeeDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsDate()
  date: Date;

  @IsString()
  userId: string;
}
