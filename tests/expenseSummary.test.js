import { describe, expect, test, beforeEach, vi } from 'vitest';
import { addExpenses } from '../src/services/expenseService.js';
import { getPeriodSummary } from '../src/services/summaryService.js';
import prisma from '../src/db/prismaClient.js';
import { getOrCreateUser } from '../src/services/userService.js';

vi.mock('../src/db/prismaClient.js', () => {
  const db = {
    user: { findUnique: vi.fn(), create: vi.fn() },
    expense: {
      createMany: vi.fn(),
      groupBy: vi.fn(),
    },
    income: { groupBy: vi.fn() },
  };
  return { default: db };
});

vi.mock('../src/services/userService.js', async () => {
  const actual = await vi.importActual('../src/services/userService.js');
  return { ...actual, getOrCreateUser: vi.fn() };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('expense add and summary', () => {
  test('adds expenses and summarizes', async () => {
    const user = { id: 'u1', telegramId: BigInt(1) };
    getOrCreateUser.mockResolvedValue(user);
    prisma.expense.createMany.mockResolvedValue({ count: 2 });
    await addExpenses('1', [
      { amount: 10, description: 'a' },
      { amount: 20, description: 'b' },
    ]);
    expect(prisma.expense.createMany).toHaveBeenCalled();

    prisma.expense.groupBy.mockResolvedValue([
      { categoryId: null, _sum: { amount: 30 } },
    ]);
    prisma.income.groupBy.mockResolvedValue([]);
    const summary = await getPeriodSummary('u1', 'day');
    expect(summary.totalExpense).toBe(30);
  });
});
