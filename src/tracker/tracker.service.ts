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
  ): Promise<{ goalName: string; percentage: number; id: string }[]> {
    // const percentages = [];
    const goals = await this.goalService.getGoalsByUserId(userId);
    const incomes = await this.budgetService.getIncomeByUser(userId);
    const expenses = await this.payeeService.getExpensesByUser(userId);
    const netIncome = this.calculateNetIncome(incomes, expenses, goals);
    return goals.map((goal) => {
      return {
        goalName: goal.name,
        percentage: this.calculatePercentage(netIncome, goal),
        id: goal._id,
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
    goals: Goal[],
  ): Array<{ date: string; netIncome: number }> {
    const sortedGoals: Goal[] = [...goals].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
    const sortedIncomes: Budget[] = [...incomes].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
    const sortedExpenses: Payee[] = [...expenses].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );

    const netIncomes: Array<{ date: string; netIncome: number }> = [];
    let totalIncome: number = 0;
    let totalExpenses: number = 0;
    let currentIncomeIndex: number = 0;
    let currentExpenseIndex: number = 0;

    for (const sortedGoal of sortedGoals) {
      while (
        currentIncomeIndex < sortedIncomes.length &&
        sortedIncomes[currentIncomeIndex].date <= sortedGoal.date
      ) {
        totalIncome += sortedIncomes[currentIncomeIndex].amount;
        currentIncomeIndex++;
      }
      while (
        currentExpenseIndex < sortedExpenses.length &&
        sortedExpenses[currentExpenseIndex].date <= sortedGoal.date
      ) {
        totalExpenses += sortedExpenses[currentExpenseIndex].amount;
        currentExpenseIndex++;
      }
      netIncomes.push({
        date: sortedGoal.date.toISOString().split('T')[0],
        netIncome: totalIncome - totalExpenses,
      });
    }

    return netIncomes;
  }

  calculatePercentage(
    netIncome: Array<{ date: string; netIncome: number }>,
    goal: Goal,
  ) {
    const goalDate = goal.date.toISOString().split('T')[0];
    for (const income of netIncome) {
      if (goalDate === income.date) {
        return parseFloat(((goal.amount / income.netIncome) * 100).toFixed(2));
      }
    }
  }
}
