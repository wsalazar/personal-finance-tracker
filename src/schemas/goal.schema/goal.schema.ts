import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GoalDocument = HydratedDocument<Goal>;

@Schema()
export class Goal {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  userId: string;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
