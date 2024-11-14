import { Test, TestingModule } from '@nestjs/testing';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { PayeeController } from 'src/payee/payee.controller';
import { PayeeService } from 'src/payee/payee.service';

describe('BudgetController', () => {
  let budgetController: BudgetController;
  let payeeController: PayeeController;
  let budgetService: BudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetController, PayeeController],
      providers: [
        {
          provide: BudgetService,
          useValue: {
            getIncome: jest.fn().mockResolvedValue(1000),
            create: jest.fn().mockResolvedValue({ income: 1000 }),
            getBalance: jest.fn().mockResolvedValue(500),
          },
        },
        {
          provide: PayeeService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                name: 'Some Bill 1',
                amount: 200,
                memo: 'Bill',
                date: '2024-10-23T00:00:00.000Z',
              },
              {
                name: 'Some Bill 2',
                amount: 50,
                memo: 'Verizon Bill',
                date: '2024-11-29T00:00:00.000Z',
              },
              {
                name: 'Some Bill 3',
                amount: 50,
                memo: 'T Mobil bill',
                date: '2024-12-10T00:00:00.000Z',
              },
              {
                name: 'Some Bill 4',
                amount: 200,
                memo: 'Light bill',
                date: '2024-10-23T00:00:00.000Z',
              },
            ]),
          },
        },
      ],
    }).compile();

    budgetController = module.get<BudgetController>(BudgetController);
    payeeController = module.get<PayeeController>(PayeeController);
    budgetService = module.get<BudgetService>(BudgetService);
  });

  it('should be defined', () => {
    expect(budgetController).toBeDefined();
  });

  it('should make sure that income is 1000', async () => {
    const result = await budgetController.getIncome();
    expect(result).toBe(1000);
    expect(budgetService.getIncome).toHaveBeenCalled();
  });

  it('should make sure that income can be created with 1000', async () => {
    const budgetDto = { income: 1000 };
    const result = await budgetController.insertBudget(budgetDto);
    expect(result.income).toBe(1000);
    expect(budgetService.create).toHaveBeenCalled();
  });

  it('should make sure that balance is 500', async () => {
    const budgetDto = { income: 1000 };
    const result = await budgetController.insertBudget(budgetDto);
    const allPayees = await payeeController.findAll();
    let totalExpenses = 0;
    allPayees.forEach((payee) => {
      totalExpenses += payee.amount;
    });
    const balance = await budgetController.getBalance();
    expect(balance).toBe(result.income - totalExpenses);
    expect(budgetService.getBalance).toHaveBeenCalled();
  });
});
