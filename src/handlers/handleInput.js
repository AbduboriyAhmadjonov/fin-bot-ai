import keyboard from '../keyboards/main.js';

export async function handleExpenseInput(ctx) {
  const message = ctx.message.text;
  const entries = message.split(',').map((s) => s.trim());

  const parsed = entries.map((entry) => {
    const parts = entry.split(' ');
    const amount = parseInt(parts[0]);
    const description = parts.slice(1).join(' ');
    return { amount, description };
  });

  const isValid = parsed.every((e) => e.amount && e.description);

  if (!isValid) {
    return ctx.reply('❌ Invalid format. Try again or press ❌ Cancel.');
  }

  ctx.session.expensesToConfirm = parsed;

  let summary = parsed
    .map((p) => `• ${p.amount} - ${p.description}`)
    .join('\n');

  return ctx.reply(
    `Please confirm these expenses:\n\n${summary}`,
    keyboard.confirmOrCancelExpenses
  );
}

export async function handleIncomeInput(ctx) {
  const message = ctx.message.text;
  const entries = message.split(',').map((s) => s.trim());

  const parsed = entries.map((entry) => {
    const parts = entry.split(' ');
    const amount = parseInt(parts[0]);
    const description = parts.slice(1).join(' ');
    return { amount, description };
  });

  const isValid = parsed.every((e) => e.amount && e.description);

  if (!isValid) {
    return ctx.reply('❌ Invalid format. Try again or press ❌ Cancel.');
  }

  ctx.session.incomesToConfirm = parsed;

  let summary = parsed
    .map((p) => `• ${p.amount} - ${p.description}`)
    .join('\n');

  return ctx.reply(
    `Please confirm these incomes:\n\n${summary}`,
    keyboard.confirmOrCancelIncomes
  );
}
