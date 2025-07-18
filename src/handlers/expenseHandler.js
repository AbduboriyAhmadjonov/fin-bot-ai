// import keyboard from '../keyboards/main.js';
// import { addExpense } from '../services/index.js';
// import categoryHandler from './index.js';

// export default async function expenseHandler(bot) {
//   bot.hears('➕💸 Add Expense', async (ctx) => {
//     ctx.session ??= {};
//     ctx.session.state = 'awaiting_expense';

//     await ctx.reply(
//       'Send your expense (e.g., `10000 food`).\nYou can send multiple using commas.\n\nPress ❌ Cancel to go back.',
//       keyboard.cancelKeyboard
//     );
//   });

//   bot.action('CONFIRM_EXPENSES', async (ctx) => {
//     const userId = ctx.from.id;
//     const expenses = ctx.session?.expensesToConfirm || [];

//     const categories = await categoryHandler(bot, ctx, expenses);

//     if (!categories || categories.length === 0) {
//       await ctx.reply('❌ Something went wrong. Please try again.');
//       return;
//     }

//     // Save to DB here...
//     addExpense({
//       userId: userId.toString(),
//       expenses: expenses,
//     });

//     ctx.session = null;
//     await ctx.editMessageText('✅ Expenses added successfully.');
//     await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
//   });

//   bot.action('CANCEL_EXPENSES', async (ctx) => {
//     // ctx.session = null;
//     await ctx.editMessageText('❌ Expense entry canceled.');
//     await ctx.reply(
//       'Try again\nSend your expense (e.g., `10000 food`).\nYou can send multiple using commas.\n\nPress ❌ Cancel to go back.',
//       keyboard.cancelKeyboard
//     );
//     // await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
//   });
// }

import keyboard from '../keyboards/main.js';
import { addExpense } from '../services/index.js';

export default function expenseHandler(bot) {
  // 1. Start Expense Flow
  // bot.hears('➕💸 Add Expense', async (ctx) => {
  bot.action('ADD_EXPENSE', async (ctx) => {
    ctx.session.state = 'awaiting_expense';
    ctx.session.expensesToConfirm = [];

    await ctx.reply(
      '🧾 Send your expenses like:\n`10000 Food, 2000 Transport`\n\nPress ❌ Cancel to go back.',
      keyboard.cancelKeyboard
    );
  });

  // 2. Handle Expense Input
  bot.on('text', async (ctx) => {
    if (ctx.session.state !== 'awaiting_expense') return;

    const input = ctx.message.text;
    if (!input) return;

    const entries = input.split(',').map((entry) => {
      const [amount, ...desc] = entry.trim().split(' ');
      return {
        amount: parseFloat(amount),
        description: desc.join(' ') || 'No description',
      };
    });

    const valid = entries.every((e) => !isNaN(e.amount) && e.amount > 0);
    if (!valid) {
      return ctx.reply('❌ Invalid format. Try: `10000 Food, 2000 Taxi`');
    }

    ctx.session.expensesToConfirm = entries;

    let confirmText = '❓ Confirm these expenses:\n\n';
    entries.forEach((e) => {
      confirmText += `➖ ${e.amount} - ${e.description}\n`;
    });

    await ctx.reply(confirmText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Confirm', callback_data: 'CONFIRM_EXPENSES' }],
          [{ text: '❌ Cancel', callback_data: 'CANCEL_EXPENSES' }],
        ],
      },
    });
  });

  // 3. Confirm & Save
  bot.action('CONFIRM_EXPENSES', async (ctx) => {
    const userId = ctx.from.id;
    const expenses = ctx.session?.expensesToConfirm || [];

    try {
      await addExpense({
        telegramId: userId.toString(),
        expenses: expenses,
      });

      ctx.session.state = null;
      ctx.session.expensesToConfirm = [];
      await ctx.editMessageText('✅ Expenses saved.');
      await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
    } catch (error) {
      console.error('Failed to save expenses:', error);
      await ctx.reply('❌ Failed to save expenses. Try again.');
    }
  });

  // 4. Cancel Flow
  bot.action('CANCEL_EXPENSES', async (ctx) => {
    ctx.session.state = null;
    ctx.session.expensesToConfirm = [];
    await ctx.editMessageText('❌ Expense entry canceled.');
    await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
  });
}
