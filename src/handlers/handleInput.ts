import type { BotContext } from '../types.js';
import keyboard from '../keyboards/main.js';

export async function handleExpenseInput(ctx: BotContext): Promise<void> {
  const message = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
  const entries = message.split(',').map((s) => s.trim());

  const parsed = entries.map((entry) => {
    const parts = entry.split(' ');
    const amount = parseFloat(parts[0]);
    const description = parts.slice(1).join(' ');
    return { amount, description };
  });

  const isValid = parsed.every((e) => e.amount && e.description);

  if (!isValid) {
    await ctx.reply('❌ Invalid format. Try again or press ❌ Cancel.');
    return;
  }

  ctx.session.expensesToConfirm = parsed;

  const summary = parsed
    .map((p) => `• ${p.amount} - ${p.description}`)
    .join('\n');

  await ctx.reply(
    `Please confirm these expenses:\n\n${summary}`,
    keyboard.confirmOrCancelExpenses
  );
}

export async function handleIncomeInput(ctx: BotContext): Promise<void> {
  const message = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
  const entries = message.split(',').map((s) => s.trim());

  const parsed = entries.map((entry) => {
    const parts = entry.split(' ');
    const amount = parseFloat(parts[0]);
    const description = parts.slice(1).join(' ');
    return { amount, description };
  });

  const isValid = parsed.every((e) => e.amount && e.description);

  if (!isValid) {
    await ctx.reply('❌ Invalid format. Try again or press ❌ Cancel.');
    return;
  }

  ctx.session.incomesToConfirm = parsed;

  const summary = parsed
    .map((p) => `• ${p.amount} - ${p.description}`)
    .join('\n');

  await ctx.reply(
    `Please confirm these incomes:\n\n${summary}`,
    keyboard.confirmOrCancelIncomes
  );
}
