import { Context, Scenes } from 'telegraf';
import type { Prisma } from './db/generated/prisma/index.js';

export interface SessionData extends Scenes.WizardSessionData {
  isAdmin: boolean;
  botState: string | null;
  currency: string | null;
  language: string | null;
  onboardingStep: string | null;
  summaryPeriod: string | null;
  expensesToConfirm: TransactionEntry[];
  incomesToConfirm: TransactionEntry[];
}

export interface TransactionEntry {
  amount: number;
  description: string;
  categoryId?: string;
  timestamp?: Date;
}

export interface BotContext extends Context {
  session: SessionData & Scenes.SceneSession<Scenes.WizardSessionData>;
  scene: Scenes.SceneContextScene<BotContext, Scenes.WizardSessionData>;
  wizard: Scenes.WizardContextWizard<BotContext>;
  t: (key: string, params?: Record<string, string>) => Promise<string>;
  setLang: (lang: string) => void;
  match?: RegExpExecArray;
}

export type SummaryPeriod = 'today' | 'week' | 'month' | 'year' | 'all';

export interface CategoryGroup {
  total: number;
  count: number;
  items: Array<{
    amount: Prisma.Decimal;
    description: string | null;
    category?: { name: string } | null;
    timestamp: Date;
  }>;
}

export interface SummaryData {
  user: {
    id: string;
    currency: string;
  };
  period: SummaryPeriod;
  expenses: Array<{
    amount: Prisma.Decimal;
    description: string | null;
    category?: { name: string } | null;
    timestamp: Date;
  }>;
  incomes: Array<{
    amount: Prisma.Decimal;
    description: string | null;
    category?: { name: string } | null;
    timestamp: Date;
  }>;
  totalExpense: number;
  totalIncome: number;
  balance: number;
  expensesByCategory: Record<string, CategoryGroup>;
  incomesByCategory: Record<string, CategoryGroup>;
}
