import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GoalDocument = Goal & Document;

@Schema()
export class Goal extends Document {
  _id: string;

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
