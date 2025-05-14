import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
