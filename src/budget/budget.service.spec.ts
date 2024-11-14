import { Test, TestingModule } from '@nestjs/testing';
import { BudgetService } from './budget.service';

describe.skip('BudgetService', () => {
  let service: BudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudgetService],
    }).compile();

    service = module.get<BudgetService>(BudgetService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
