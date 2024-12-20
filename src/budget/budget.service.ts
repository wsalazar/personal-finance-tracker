import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBudgetDto } from 'src/dto/create-budget.dto';
import { Budget } from 'src/schemas/budget.schema/budget.schema';
import { Payee } from 'src/schemas/payee.schema/payee.schema';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
    @InjectModel(Payee.name) private payeeModel: Model<Payee>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const createdBudget = new this.budgetModel(createBudgetDto);
    return createdBudget.save();
  }

  async edit(
    id: string,
    editBudgetDto: Partial<CreateBudgetDto>,
  ): Promise<{
    acknowledged: boolean;
    matchedCount: number;
    modifiedCount: number;
  }> {
    const income = await this.budgetModel
      .updateOne({ _id: Object(id) }, { ...editBudgetDto })
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

  async getIncome(): Promise<Budget[]> {
    return this.budgetModel.find().exec();
  }

  async getBalance(): Promise<number> {
    const budget = await this.budgetModel.find({}, { income: 1 }).exec();
    const result = await this.payeeModel.aggregate([
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      },
    ]);
    return budget[0]?.amount - result[0]?.total;
  }

  async fetchIncomeById(id: string): Promise<Budget> {
    const result = await this.budgetModel.findOne({ _id: Object(id) }).exec();
    if (result.errors) {
      throw new NotFoundException('Income not found.');
    }
    return result;
  }

  async deleteIncomeById(id: string): Promise<void> {
    const result = await this.budgetModel.deleteOne({ _id: Object(id) });
    if (!result.acknowledged) {
      throw new NotFoundException('Income not found.');
    }
  }

  async incomeCount(): Promise<boolean> {
    return (await this.budgetModel.countDocuments()) > 0;
  }
}
