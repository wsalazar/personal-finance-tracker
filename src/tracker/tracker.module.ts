import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payee, PayeeSchema } from 'src/schemas/payee.schema/payee.schema';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';
import { Budget, BudgetSchema } from 'src/schemas/budget.schema/budget.schema';
import { Goal, GoalSchema } from 'src/schemas/goal.schema/goal.schema';
import { GoalService } from 'src/goals/goal.service';
import { PayeeService } from 'src/payee/payee.service';
import { BudgetService } from 'src/budget/budget.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }]),
    MongooseModule.forFeature([{ name: Payee.name, schema: PayeeSchema }]),
    MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }]),
  ],
  controllers: [TrackerController],
  providers: [TrackerService, GoalService, PayeeService, BudgetService],
  exports: [TrackerService],
})
export class TrackerModule {}
