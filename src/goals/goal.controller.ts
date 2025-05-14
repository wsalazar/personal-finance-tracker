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

@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Get('verification/:userId')
  async checkIncomeExpensesExist(
    @Param('userId') userId: string,
  ): Promise<boolean> {
    return await this.goalService.checkIncomeExpenseExists(userId);
  }
  /**
   * This has to be findAll for a particular user not all in the collection
   * @returns
   */
  @Get(':userId')
  getGoals(@Param('userId') userId: string): Promise<Goal[]> {
    return this.goalService.getGoalsByUserId(userId);
  }

  @Get('goal/:id')
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
  ): Promise<{
    acknowledged: boolean;
    matchedCount: number;
    modifiedCount: number;
  }> {
    return this.goalService.edit(id, editGoalDto);
  }

  @Delete(':id')
  deleteGoalDictionary(@Param('id') id: string) {
    return this.goalService.deleteGoalById(id);
  }
}
