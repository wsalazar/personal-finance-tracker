import { Injectable } from '@nestjs/common';
import { CreatePayeeDto } from '../dto/create-payee.dto';
import { UpdatePayeeDto } from '../dto/update-payee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payee } from 'src/schemas/payee.schema/payee.schema';
import { Model } from 'mongoose';

@Injectable()
export class PayeeService {
  constructor(@InjectModel(Payee.name) private payeeModel: Model<Payee>) {}

  create(createPayeeDto: CreatePayeeDto) {
    const createPayee = new this.payeeModel(createPayeeDto);
    return createPayee.save();
  }

  findAll(): Promise<Payee[]> {
    return this.payeeModel.find().exec();
  }

  findOne(id: string) {
    return this.payeeModel.findOne({ _id: Object(id) }).exec();
  }

  update(id: string, updatePayeeDto: UpdatePayeeDto) {
    return this.payeeModel
      .updateOne({ _id: Object(id) }, { $set: updatePayeeDto })
      .exec();
  }

  remove(id: string) {
    return this.payeeModel.deleteOne({ _id: Object(id) }).exec();
  }

  async expenseCount(): Promise<boolean> {
    return (await this.payeeModel.countDocuments()) > 0;
  }
}
