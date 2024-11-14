import { Test, TestingModule } from '@nestjs/testing';
import { PayeeService } from './payee.service';

describe.skip('PayeeService', () => {
  let service: PayeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayeeService],
    }).compile();

    service = module.get<PayeeService>(PayeeService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
