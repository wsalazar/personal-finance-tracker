import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { PayeeService } from './payee.service';
import { CreatePayeeDto } from '../dto/create-payee.dto';
import { UpdatePayeeDto } from '../dto/update-payee.dto';
import { Payee } from './entities/payee.entity';
import path from 'path';

@Controller('expenses')
export class PayeeController {
  constructor(private readonly payeeService: PayeeService) {}

  @Post()
  create(@Body() createPayeeDto: CreatePayeeDto) {
    return this.payeeService.create(createPayeeDto);
  }

  /**
   * This has to be findAll for a particular user not all in the collection
   * @returns
   */
  @Get(':userId')
  async findExpensesByUser(@Param('userId') userId: string): Promise<Payee[]> {
    return await this.payeeService.getExpensesByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payeeService.findOne(id);
  }

  @Patch(':id')
  updateField(
    @Param('id') id: string,
    @Body() updateData: { field: string; value: string | number | Date },
  ): void {
    this.payeeService.updateField(id, updateData);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePayeeDto: UpdatePayeeDto,
  ): void {
    this.payeeService.update(id, updatePayeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payeeService.remove(id);
  }
}
