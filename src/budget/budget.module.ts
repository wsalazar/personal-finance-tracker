import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Budget, BudgetSchema } from 'src/schemas/budget.schema/budget.schema';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { Payee, PayeeSchema } from 'src/schemas/payee.schema/payee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Budget.name, schema: BudgetSchema },
      { name: Payee.name, schema: PayeeSchema },
    ]),
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
  exports: [BudgetService],
})
export class BudgetModule {}
