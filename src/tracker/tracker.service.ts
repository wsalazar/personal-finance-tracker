import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payee } from 'src/schemas/payee.schema/payee.schema';
import { Model } from 'mongoose';
import { Budget } from 'src/schemas/budget.schema/budget.schema';
import { Goal } from 'src/schemas/goal.schema/goal.schema';
import { PayeeService } from 'src/payee/payee.service';
import { BudgetService } from 'src/budget/budget.service';
import { GoalService } from 'src/goals/goal.service';
import exp from 'constants';

@Injectable()
export class TrackerService {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly payeeService: PayeeService,
    private readonly goalService: GoalService,
  ) {}

  async getFinanceTracker(
    userId: string,
  ): Promise<{ goalName: string; percentage: number }[]> {
    // const percentages = [];
    const goals = await this.goalService.getGoalsByUserId(userId);
    const incomes = await this.budgetService.getIncomeByUser(userId);
    const expenses = await this.payeeService.getExpensesByUser(userId);
    const netIncome = this.calculateNetIncome(incomes, expenses);
    return goals.map((goal) => {
      return {
        goalName: goal.name,
        percentage: this.calculatePercentage(netIncome, goal),
      };
    });
  }

  getExpenseMaxDate(dates: Array<string>): string {
    return new Date(Math.max(...dates.map((date) => Date.parse(date))))
      .toISOString()
      .split('T')[0];
  }

  calculateNetIncome(
    incomes: Budget[],
    expenses: Payee[],
  ): Array<{ date: string; netIncome: number }> {
    /**
     * I want to iterate over expenses and income and if the expense has a larger date then the income I want to subtract that the income from the expense.
     *
     */
    let netIncome: number = 0;
    let expenseDates: string[] = [];
    for (const expense of expenses) {
      for (const income of incomes) {
        if (expense.date >= income.date) {
          expenseDates.push(expense.date.toISOString());
          netIncome = income.amount - expense.amount + netIncome;
        }
      }
    }
    return [
      {
        date: new Date().toISOString().split('T')[0],
        netIncome: netIncome,
      },
    ];
  }

  calculatePercentage(
    netIncome: Array<{ date: string; netIncome: number }>,
    goal: Goal,
  ) {
    const goalDate = goal.date.toISOString().split('T')[0];
    for (const income of netIncome) {
      if (goalDate > income.date) {
        return parseFloat(((goal.amount / income.netIncome) * 100).toFixed(2));
      }
    }
  }
}
