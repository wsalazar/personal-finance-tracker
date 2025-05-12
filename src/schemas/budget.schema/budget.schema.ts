import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BudgetDocument = HydratedDocument<Budget>;

@Schema()
export class Budget {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  incomeSource: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ reqired: true })
  userId: string;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
