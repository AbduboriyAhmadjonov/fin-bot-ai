import { describe, expect, test, beforeEach, vi } from 'vitest';
import { changeLanguage, changeCurrency, deleteAccount } from '../src/services/settingsService.js';
import prisma from '../src/db/prismaClient.js';

vi.mock('../src/db/prismaClient.js', () => {
  const db = {
    user: {
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  return { default: db };
});

beforeEach(() => vi.clearAllMocks());

describe('settings operations', () => {
  test('update language and currency then delete account', async () => {
    prisma.user.update.mockResolvedValue({});
    await changeLanguage('1', 'en');
    expect(prisma.user.update).toHaveBeenCalled();
    await changeCurrency('1', 'USD');
    expect(prisma.user.update).toHaveBeenCalledTimes(2);

    prisma.user.delete.mockResolvedValue({});
    await deleteAccount('1');
    expect(prisma.user.delete).toHaveBeenCalled();
  });
});
