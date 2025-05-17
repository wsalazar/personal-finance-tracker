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

  async getExpensesByUser(userId: string): Promise<Payee[]> {
    return await this.payeeModel.find({ userId: userId }).exec();
  }

  findOne(id: string): Promise<Payee> {
    return this.payeeModel.findOne({ _id: Object(id) }).exec();
  }

  update(id: string, updatePayeeDto: UpdatePayeeDto): void {
    this.payeeModel
      .updateOne({ _id: Object(id) }, { $set: updatePayeeDto })
      .exec();
  }

  updateField(
    id: string,
    updateData: { field: string; value: string | number | Date },
  ): void {
    const update = { $set: updateData };
    console.log(update);
    this.payeeModel
      .findByIdAndUpdate({ _id: Object(id) }, update, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.payeeModel.deleteOne({ _id: Object(id) }).exec();
  }

  async expenseCount(userId: string): Promise<boolean> {
    return (await this.payeeModel.countDocuments({ userId: userId })) > 0;
  }
}
