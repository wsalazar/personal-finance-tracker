import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from 'src/dto/create-budget.dto';
import { AuthGuard } from '@nestjs/passport';
import { Budget } from 'src/schemas/budget.schema/budget.schema';

@Controller('income')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  /**
   * This has to be findAll for a particular user not all in the collection
   * @returns
   */
  @Get('/user/:userId')
  async getAllIncomeByUser(@Param('userId') userId: string): Promise<Budget[]> {
    return await this.budgetService.getIncomeByUser(userId);
  }

  @Get('single-item/:id')
  async getIncomeById(@Param('id') id: string): Promise<Budget> {
    return await this.budgetService.fetchIncomeById(id);
  }

  @Patch(':id')
  editIncomeField(
    @Param('id') id: string,
    @Body() updateData: { field: string; value: string | number | Date },
  ): void {
    this.budgetService.updateField(id, updateData);
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  insertBudget(@Body() createBudgetDto: CreateBudgetDto): Promise<Budget> {
    return this.budgetService.create(createBudgetDto);
  }

  @Put(':id')
  editIncome(
    @Param('id') id: string,
    @Body() editBudgetDto: Partial<CreateBudgetDto>,
  ): any {
    return this.budgetService.edit(id, editBudgetDto);
  }

  @Get('/balance')
  getBalance(): Promise<number> {
    return this.budgetService.getBalance();
  }

  @Delete(':id')
  deleteIncomeRecord(@Param('id') id: string) {
    return this.budgetService.deleteIncomeById(id);
  }
}
