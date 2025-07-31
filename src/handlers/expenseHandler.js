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
      await ctx.t('expense.welcome'),
      await keyboard.cancelKeyboard(ctx.t)
    );
    return ctx.wizard.next(); // move to step 1
  },

  // Step 1 – parse & confirm
  async (ctx) => {
    if (ctx.message?.text === '❌ Cancel') {
      await ctx.reply(
        '❌ Expense entry canceled.',
        await keyboard.mainMenu(ctx.t)
      );
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
      await ctx.reply(await ctx.t('invalid_format'));
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
      await ctx.editMessageText(await ctx.t('expense.saved'));
      await ctx.reply(
        await ctx.t('back_to_main_menu'),
        await keyboard.mainMenu(ctx.t)
      );
    } else if (data === 'CANCEL_EXPENSES') {
      await ctx.editMessageText(
        await ctx.t('expense.canceled'),
        await keyboard.mainMenu(ctx.t)
      );
      await ctx.reply(
        await ctx.t('back_to_main_menu'),
        await keyboard.mainMenu(ctx.t)
      );
    }

    return ctx.scene.leave();
  }
);
