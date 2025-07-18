import { describe, expect, test, beforeEach, vi } from 'vitest';
import { getOrCreateUser } from '../src/services/userService.js';
import { ensureDefaultCategories } from '../src/services/categoryService.js';
import prisma from '../src/db/prismaClient.js';

vi.mock('../src/db/prismaClient.js', () => {
  const db = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    category: {
      findFirst: vi.fn(),
      createMany: vi.fn(),
    },
  };
  return { default: db };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('user creation and default categories', () => {
  test('creates user if not exists and ensures default categories only once', async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);
    prisma.user.create.mockResolvedValueOnce({ id: 'u1', telegramId: BigInt(1) });

    const user = await getOrCreateUser('1');
    expect(prisma.user.create).toHaveBeenCalled();
    expect(user.id).toBe('u1');

    prisma.category.findFirst.mockResolvedValueOnce(null);
    prisma.category.createMany.mockResolvedValueOnce({ count: 8 });
    await ensureDefaultCategories('u1');
    expect(prisma.category.createMany).toHaveBeenCalledTimes(1);

    prisma.category.findFirst.mockResolvedValueOnce({ id: 'c1' });
    await ensureDefaultCategories('u1');
    expect(prisma.category.createMany).toHaveBeenCalledTimes(1);
  });
});
