import { Test, TestingModule } from '@nestjs/testing';
import { BudgetResolver } from './budget.resolver';

describe.skip('BudgetResolver', () => {
  let resolver: BudgetResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudgetResolver],
    }).compile();

    resolver = module.get<BudgetResolver>(BudgetResolver);
  });

  it.skip('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
