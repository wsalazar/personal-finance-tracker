import { Budget } from './budget.schema';

describe('BudgetSchema', () => {
  it('should be defined', () => {
    expect(new Budget()).toBeDefined();
  });
});
