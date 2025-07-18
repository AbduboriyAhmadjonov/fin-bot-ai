import keyboard from '../keyboards/main.js';
import { addIncomes } from '../services/index.js';

export default function incomeHandler(bot) {
  // Step 1: Start Income Flow
  bot.hears('➕💰 Add Income', async (ctx) => {
    ctx.session.state = 'awaiting_income';
    ctx.session.incomesToConfirm = [];

    await ctx.reply(
      '💵 Send your income like:\n`1200000 Salary`\nor multiple like:\n`1200000 Salary, 300000 Freelance`\n\nPress ❌ Cancel to go back.',
      keyboard.cancelKeyboard
    );
  });

  // Step 2: Handle Text Input for Incomes
  bot.on('text', async (ctx) => {
    if (ctx.session.state !== 'awaiting_income') return;

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
      return ctx.reply(
        '❌ Invalid format. Try again.\nExample: `1200000 Salary, 300000 Freelance`'
      );
    }

    ctx.session.incomesToConfirm = entries;

    let confirmText = '✅ Please confirm the following incomes:\n\n';
    entries.forEach((e) => {
      confirmText += `➕ ${e.amount} - ${e.description}\n`;
    });

    await ctx.reply(confirmText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Confirm', callback_data: 'CONFIRM_INCOME' }],
          [{ text: '❌ Cancel', callback_data: 'CANCEL_INCOME' }],
        ],
      },
    });
  });

  // Step 3: Save Income to DB
  bot.action('CONFIRM_INCOME', async (ctx) => {
    const userId = ctx.from.id;
    const incomes = ctx.session?.incomesToConfirm || [];

    try {
      await addIncomes(userId.toString(), incomes);

      ctx.session.state = null;
      ctx.session.incomesToConfirm = [];
      await ctx.editMessageText('✅ Income saved.');
      await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
    } catch (error) {
      console.error('Income save error:', error);
      await ctx.reply('❌ Failed to save income. Try again later.');
    }
  });

  // Step 4: Cancel Income Flow
  bot.action('CANCEL_INCOME', async (ctx) => {
    ctx.session.state = null;
    ctx.session.incomesToConfirm = [];
    await ctx.editMessageText('❌ Income entry canceled.');
    await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
  });
}
