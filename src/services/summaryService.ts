import prisma from '../db/prismaClient.js';
import type { Prisma } from '../db/generated/prisma/index.js';
import { getUserByTelegramId } from './userService.js';
import type { SummaryPeriod, SummaryData, CategoryGroup } from '../types.js';

interface DateRange {
  gte: Date;
  lte: Date;
}

function getDateRange(period: SummaryPeriod): DateRange | Record<string, never> {
  const now = new Date();
  const start = new Date(now);

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'all':
      return {};
    default:
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
  }

  return { gte: start, lte: now };
}

export async function getSummary(telegramId: number | bigint, period: SummaryPeriod = 'month'): Promise<SummaryData> {
  const user = await getUserByTelegramId(telegramId);
  if (!user) throw new Error('User not found');

  const dateFilter = getDateRange(period);
  const timestampWhere = 'gte' in dateFilter ? { timestamp: dateFilter } : {};

  const expenses = await prisma.expense.findMany({
    where: { userId: user.id, ...timestampWhere },
    include: { category: true },
    orderBy: { timestamp: 'desc' },
  });

  const incomes = await prisma.income.findMany({
    where: { userId: user.id, ...timestampWhere },
    include: { category: true },
    orderBy: { timestamp: 'desc' },
  });

  const totalExpense = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );
  const totalIncome = incomes.reduce(
    (sum, i) => sum + Number(i.amount),
    0
  );
  const balance = totalIncome - totalExpense;

  const expensesByCategory = groupByCategory(expenses);
  const incomesByCategory = groupByCategory(incomes);

  return {
    user,
    period,
    expenses,
    incomes,
    totalExpense,
    totalIncome,
    balance,
    expensesByCategory,
    incomesByCategory,
  };
}

function groupByCategory(items: Array<{ amount: Prisma.Decimal; category?: { name: string } | null; [key: string]: unknown }>): Record<string, CategoryGroup> {
  const groups: Record<string, CategoryGroup> = {};
  for (const item of items) {
    const name = item.category?.name || 'Uncategorized';
    if (!groups[name]) {
      groups[name] = { total: 0, count: 0, items: [] };
    }
    groups[name].total += Number(item.amount);
    groups[name].count += 1;
    groups[name].items.push(item as CategoryGroup['items'][number]);
  }
  return groups;
}

const periodLabels: Record<SummaryPeriod, string> = {
  today: '📅 Today',
  week: '📅 Last 7 Days',
  month: '📅 This Month',
  year: '📅 This Year',
  all: '📅 All Time',
};

export function formatTextSummary(summary: SummaryData): string {
  const { period, totalExpense, totalIncome, balance, expensesByCategory, incomesByCategory, user } = summary;
  const currency = user.currency || 'USD';
  const fmt = (n: number) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  let text = `📊 *Financial Summary*\n`;
  text += `${periodLabels[period]}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  text += `💰 *Income:* ${fmt(totalIncome)} ${currency}\n`;
  if (Object.keys(incomesByCategory).length > 0) {
    for (const [cat, data] of Object.entries(incomesByCategory)) {
      text += `   🟢 ${cat}: ${fmt(data.total)} (${data.count}x)\n`;
    }
  }
  text += `\n`;

  text += `💸 *Expenses:* ${fmt(totalExpense)} ${currency}\n`;
  if (Object.keys(expensesByCategory).length > 0) {
    for (const [cat, data] of Object.entries(expensesByCategory)) {
      text += `   🔴 ${cat}: ${fmt(data.total)} (${data.count}x)\n`;
    }
  }
  text += `\n`;

  text += `━━━━━━━━━━━━━━━━━━━━\n`;
  const balanceEmoji = balance >= 0 ? '📈' : '📉';
  text += `${balanceEmoji} *Balance:* ${fmt(balance)} ${currency}\n`;

  if (summary.expenses.length === 0 && summary.incomes.length === 0) {
    text += `\n_No transactions found for this period._`;
  }

  return text;
}

export function generateCSV(summary: SummaryData): string {
  const { expenses, incomes, user } = summary;
  const currency = user.currency || 'USD';

  const rows: string[][] = [['Type', 'Amount', 'Currency', 'Category', 'Description', 'Date']];

  for (const inc of incomes) {
    rows.push([
      'Income',
      Number(inc.amount).toFixed(2),
      currency,
      inc.category?.name || 'Uncategorized',
      inc.description || '',
      inc.timestamp.toISOString().split('T')[0],
    ]);
  }

  for (const exp of expenses) {
    rows.push([
      'Expense',
      Number(exp.amount).toFixed(2),
      currency,
      exp.category?.name || 'Uncategorized',
      exp.description || '',
      exp.timestamp.toISOString().split('T')[0],
    ]);
  }

  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
}

const pdfPeriodLabels: Record<SummaryPeriod, string> = {
  today: 'Today',
  week: 'Last 7 Days',
  month: 'This Month',
  year: 'This Year',
  all: 'All Time',
};

export async function generatePDF(summary: SummaryData): Promise<Buffer> {
  const PDFDocument = (await import('pdfkit')).default;
  const { totalExpense, totalIncome, balance, expensesByCategory, incomesByCategory, user, period } = summary;
  const currency = user.currency || 'USD';
  const fmt = (n: number) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).font('Helvetica-Bold').text('FinBot AI - Financial Summary', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text(`Period: ${pdfPeriodLabels[period]}`, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(14).font('Helvetica-Bold').text('Overview');
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total Income:    ${fmt(totalIncome)} ${currency}`);
    doc.text(`Total Expenses:  ${fmt(totalExpense)} ${currency}`);
    doc.font('Helvetica-Bold').text(`Balance:         ${fmt(balance)} ${currency}`);
    doc.moveDown(1);

    if (Object.keys(incomesByCategory).length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Income by Category');
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      for (const [cat, data] of Object.entries(incomesByCategory)) {
        doc.text(`  ${cat}: ${fmt(data.total)} ${currency} (${data.count} transactions)`);
      }
      doc.moveDown(1);
    }

    if (Object.keys(expensesByCategory).length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Expenses by Category');
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      for (const [cat, data] of Object.entries(expensesByCategory)) {
        doc.text(`  ${cat}: ${fmt(data.total)} ${currency} (${data.count} transactions)`);
      }
      doc.moveDown(1);
    }

    interface TransactionWithType {
      amount: Prisma.Decimal;
      description: string | null;
      category?: { name: string } | null;
      timestamp: Date;
      type: string;
    }

    const allTransactions: TransactionWithType[] = [
      ...summary.incomes.map((i) => ({ ...i, type: 'Income' })),
      ...summary.expenses.map((e) => ({ ...e, type: 'Expense' })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (allTransactions.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Recent Transactions');
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');

      for (const tx of allTransactions.slice(0, 50)) {
        const date = new Date(tx.timestamp).toLocaleDateString('en-US');
        const sign = tx.type === 'Income' ? '+' : '-';
        const cat = tx.category?.name || 'Uncategorized';
        const desc = tx.description || '';
        doc.text(`${date}  ${sign}${fmt(Number(tx.amount))} ${currency}  [${cat}]  ${desc}`);
      }

      if (allTransactions.length > 50) {
        doc.moveDown(0.5);
        doc.font('Helvetica-Oblique').text(`... and ${allTransactions.length - 50} more transactions`);
      }
    }

    doc.end();
  });
}
