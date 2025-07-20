import { Scenes } from 'telegraf';
import keyboard from '../keyboards/main.js';
import { addExpense } from '../services/index.js';

const { WizardScene } = Scenes;

export const expenseScene = new WizardScene(
  'expense-wizard',

  // Step 0 – ask for input
  async (ctx) => {
    ctx.session.expensesToConfirm = [];
    await ctx.reply(
      '🧾 Send your expenses like:\n`10000 Food, 2000 Transport`\n\nPress ❌ Cancel to go back.',
      keyboard.cancelKeyboard
    );
    return ctx.wizard.next(); // move to step 1
  },

  // Step 1 – parse & confirm
  async (ctx) => {
    if (ctx.message?.text === '❌ Cancel') {
      await ctx.reply('❌ Expense entry canceled.', keyboard.mainMenu);
      return ctx.scene.leave();
    }

    const input = ctx.message?.text;
    if (!input) return;

    const entries = input
      .split(',')
      .map((e) => {
        const [amount, ...desc] = e.trim().split(' ');
        return {
          amount: parseFloat(amount),
          description: desc.join(' ') || 'No description',
        };
      })
      .filter((e) => !isNaN(e.amount) && e.amount > 0);

    if (!entries.length) {
      await ctx.reply('❌ Invalid format. Try: `10000 Food, 2000 Taxi`');
      return; // stay on the same step
    }

    ctx.session.expensesToConfirm = entries;

    let confirmText = '❓ Confirm these expenses:\n\n';
    entries.forEach(
      (e) => (confirmText += `➖ ${e.amount} - ${e.description}\n`)
    );

    await ctx.reply(confirmText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Confirm', callback_data: 'CONFIRM_EXPENSES' }],
          [{ text: '❌ Cancel', callback_data: 'CANCEL_EXPENSES' }],
        ],
      },
    });
    return ctx.wizard.next(); // move to step 2
  },

  // Step 2 – wait for inline button
  async (ctx) => {
    if (!ctx.callbackQuery) return;

    const data = ctx.callbackQuery.data;
    await ctx.answerCbQuery();

    if (data === 'CONFIRM_EXPENSES') {
      const userId = ctx.from.id.toString();
      await addExpense(userId, ctx.session.expensesToConfirm);
      await ctx.editMessageText('✅ Expenses saved.');
      await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
    } else if (data === 'CANCEL_EXPENSES') {
      await ctx.editMessageText('❌ Expense entry canceled.');
      await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
    }

    return ctx.scene.leave();
  }
);
