import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PayeeService } from './payee.service';
import { CreatePayeeDto } from '../dto/create-payee.dto';
import { UpdatePayeeDto } from '../dto/update-payee.dto';

@Controller('expenses')
export class PayeeController {
  constructor(private readonly payeeService: PayeeService) {}

  @Post()
  create(@Body() createPayeeDto: CreatePayeeDto) {
    return this.payeeService.create(createPayeeDto);
  }

  @Get()
  findAll() {
    return this.payeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payeeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayeeDto: UpdatePayeeDto) {
    return this.payeeService.update(id, updatePayeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payeeService.remove(id);
  }
}
