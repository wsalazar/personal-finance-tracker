import { Module } from '@nestjs/common';
import { PayeeService } from './payee.service';
import { PayeeController } from './payee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payee, PayeeSchema } from 'src/schemas/payee.schema/payee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payee.name, schema: PayeeSchema }]),
  ],
  controllers: [PayeeController],
  providers: [PayeeService],
  exports: [PayeeService],
})
export class PayeeModule {}
