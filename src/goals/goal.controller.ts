import { GoalService } from './goal.service';
import { CreateGoalDto } from 'src/dto/create-goal.dto';
import { Goal } from 'src/schemas/goal.schema/goal.schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Get('income/expense/verification')
  checkIncomeExpensesExist(): Promise<boolean> {
    return this.goalService.checkIncomeExpenseExists();
  }

  @Get()
  getAllIncome(): any {
    return this.goalService.getGoals();
  }

  @Get(':id')
  getGoal(@Param('id') id: string): Promise<Goal> {
    return this.goalService.fetchGoalById(id);
  }

  @Post()
  insertGoal(@Body() createBudgetDto: CreateGoalDto): void {
    this.goalService.create(createBudgetDto);
  }

  @Put(':id')
  editIncome(
    @Param('id') id: string,
    @Body() editGoalDto: Partial<CreateGoalDto>,
  ): any {
    return this.goalService.edit(id, editGoalDto);
  }

  @Delete(':id')
  deleteGoalDictionary(@Param('id') id: string) {
    return this.goalService.deleteGoalById(id);
  }
}
