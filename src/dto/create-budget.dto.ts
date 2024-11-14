import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  incomeSource: string;

  @IsNotEmpty()
  @IsDate()
  date: Date
  


}
