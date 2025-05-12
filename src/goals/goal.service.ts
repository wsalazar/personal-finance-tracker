import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BudgetService } from 'src/budget/budget.service';
import { CreateBudgetDto } from 'src/dto/create-budget.dto';
import { CreateGoalDto } from 'src/dto/create-goal.dto';
import { PayeeService } from 'src/payee/payee.service';
import { Budget } from 'src/schemas/budget.schema/budget.schema';
import { Goal } from 'src/schemas/goal.schema/goal.schema';
import { Payee } from 'src/schemas/payee.schema/payee.schema';

@Injectable()
export class GoalService {
  constructor(
    @InjectModel(Goal.name) private goalModel: Model<Goal>,
    private payeeService: PayeeService,
    private budgetService: BudgetService,
  ) {}

  async create(goalDto: CreateGoalDto): Promise<Goal> {
    const createdBudget = new this.goalModel(goalDto);
    return createdBudget.save();
  }

  async edit(
    id: string,
    goaltDto: Partial<CreateGoalDto>,
  ): Promise<{
    acknowledged: boolean;
    matchedCount: number;
    modifiedCount: number;
  }> {
    const income = await this.goalModel
      .updateOne({ _id: Object(id) }, { ...goaltDto })
      .exec();
    if (income.matchedCount === 0) {
      throw new NotFoundException('Could not find specified income.');
    }
    return {
      acknowledged: income.acknowledged,
      matchedCount: income.matchedCount,
      modifiedCount: income.modifiedCount,
    };
  }

  async getGoalsByUserId(userId: string): Promise<Goal[]> {
    return await this.goalModel.find({ userId: userId }).exec();
  }

  async fetchGoalById(id: string): Promise<Goal> {
    const result = await this.goalModel.findOne({ _id: Object(id) }).exec();
    if (result.errors) {
      throw new NotFoundException('Goal not found.');
    }
    return result;
  }

  async deleteGoalById(id: string): Promise<void> {
    const result = await this.goalModel.deleteOne({ _id: Object(id) });
    if (!result.acknowledged) {
      throw new NotFoundException('Goal not found.');
    }
  }

  async checkIncomeExpenseExists(userId: string): Promise<boolean> {
    const expenseExists = await this.payeeService.expenseCount(userId);
    const incomeExists = await this.budgetService.incomeCount(userId);
    return expenseExists && incomeExists;
  }
}
