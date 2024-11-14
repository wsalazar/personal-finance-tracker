import { Test, TestingModule } from '@nestjs/testing';
import { PayeeController } from './payee.controller';
import { PayeeService } from './payee.service';

describe.skip('PayeeController', () => {
  let controller: PayeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayeeController],
      providers: [PayeeService],
    }).compile();

    controller = module.get<PayeeController>(PayeeController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
