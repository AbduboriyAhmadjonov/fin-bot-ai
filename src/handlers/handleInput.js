import keyboard from '../keyboards/main.js';

export async function handleExpenseInput(ctx) {
  const message = ctx.message.text;
  const entries = message.split(',').map((s) => s.trim());

  const parsed = entries.map((entry) => {
    const parts = entry.split(' ');
    const amount = parseFloat(parts[0]);
    const description = parts.slice(1).join(' ').trim();
    return {
      amount,
      description,
      isValid: !isNaN(amount) && amount > 0 && description.length > 0,
    };
  });

  // Check if any entries are invalid
  const invalidEntries = parsed.filter((e) => !e.isValid);
  if (invalidEntries.length > 0) {
    let errorMsg =
      (await ctx.t('invalid_entries')) || '❌ Invalid entries detected:\n\n';

    invalidEntries.forEach((entry, i) => {
      if (isNaN(entry.amount)) {
        errorMsg += `${i + 1}. Invalid amount: "${entry.amount}"\n`;
      } else if (entry.amount <= 0) {
        errorMsg += `${i + 1}. Amount must be positive: "${entry.amount}"\n`;
      } else if (!entry.description) {
        errorMsg += `${i + 1}. Missing description for amount: "${
          entry.amount
        }"\n`;
      }
    });

    errorMsg +=
      '\n' +
      ((await ctx.t('correct_format_example')) ||
        'Example: 10000 Food, 2000 Transport');

    return ctx.reply(errorMsg);
  }

  // Filter out any potential invalid entries
  const validEntries = parsed
    .filter((e) => e.isValid)
    .map(({ amount, description }) => ({ amount, description }));

  ctx.session.expensesToConfirm = validEntries;

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
    const amount = parseFloat(parts[0]);
    const description = parts.slice(1).join(' ').trim();
    return {
      amount,
      description,
      isValid: !isNaN(amount) && amount > 0 && description.length > 0,
    };
  });

  // Check if any entries are invalid
  const invalidEntries = parsed.filter((e) => !e.isValid);
  if (invalidEntries.length > 0) {
    let errorMsg =
      (await ctx.t('invalid_entries')) || '❌ Invalid entries detected:\n\n';

    invalidEntries.forEach((entry, i) => {
      if (isNaN(entry.amount)) {
        errorMsg += `${i + 1}. Invalid amount: "${entry.amount}"\n`;
      } else if (entry.amount <= 0) {
        errorMsg += `${i + 1}. Amount must be positive: "${entry.amount}"\n`;
      } else if (!entry.description) {
        errorMsg += `${i + 1}. Missing description for amount: "${
          entry.amount
        }"\n`;
      }
    });

    errorMsg +=
      '\n' +
      ((await ctx.t('correct_format_example')) ||
        'Example: 50000 Salary, 10000 Freelance');

    return ctx.reply(errorMsg);
  }

  // Filter out any potential invalid entries
  const validEntries = parsed
    .filter((e) => e.isValid)
    .map(({ amount, description }) => ({ amount, description }));

  ctx.session.incomesToConfirm = validEntries;

  let summary = parsed
    .map((p) => `• ${p.amount} - ${p.description}`)
    .join('\n');

  return ctx.reply(
    `Please confirm these incomes:\n\n${summary}`,
    keyboard.confirmOrCancelIncomes
  );
}
