import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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

  @Get()
  getAllIncome(): any {
    return this.budgetService.getIncome();
  }

  @Get(':id')
  getIncome(@Param('id') id: string): Promise<Budget> {
    return this.budgetService.fetchIncomeById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  insertBudget(@Body() createBudgetDto: CreateBudgetDto): any {
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
