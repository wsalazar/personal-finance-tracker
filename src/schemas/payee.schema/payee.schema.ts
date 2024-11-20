import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BudgetDocument = HydratedDocument<Payee>;

@Schema()
export class Payee {
  @Prop()
  description: string;

  @Prop()
  amount: number;

  @Prop()
  date: Date;
}

export const PayeeSchema = SchemaFactory.createForClass(Payee);
