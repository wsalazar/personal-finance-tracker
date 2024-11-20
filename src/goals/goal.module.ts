import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalController } from './goal.controller';
import { Goal, GoalSchema } from 'src/schemas/goal.schema/goal.schema';
import { GoalService } from './goal.service';
import { PayeeService } from 'src/payee/payee.service';
import { BudgetService } from 'src/budget/budget.service';
import { PayeeModule } from 'src/payee/payee.module';
import { BudgetModule } from 'src/budget/budget.module';

@Module({
  imports: [
    PayeeModule,
    BudgetModule,
    MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }]),
  ],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
