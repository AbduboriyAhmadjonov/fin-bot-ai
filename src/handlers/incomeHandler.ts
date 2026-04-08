import { Scenes } from 'telegraf';
import type { BotContext } from '../types.js';
import keyboard from '../keyboards/main.js';
import { addIncome } from '../services/index.js';

export const incomeScene = new Scenes.WizardScene<BotContext>(
  'income-wizard',

  async (ctx) => {
    ctx.session.incomesToConfirm = [];
    await ctx.reply(await ctx.t('income.welcome'), keyboard.cancelKeyboard);
    return ctx.wizard.next();
  },

  async (ctx) => {
    const text = ctx.message && 'text' in ctx.message ? ctx.message.text : null;

    if (text === '❌ Cancel') {
      await ctx.reply('❌ Income entry canceled.', keyboard.mainMenu);
      return ctx.scene.leave();
    }

    if (!text) return;

    const entries = text
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
      await ctx.reply(
        '❌ Invalid format. Try again.\nExample: `1200000 Salary, 300000 Freelance`'
      );
      return;
    }

    ctx.session.incomesToConfirm = entries;

    let confirmText = '✅ Please confirm the following incomes:\n\n';
    entries.forEach(
      (i) => (confirmText += `➕ ${i.amount} - ${i.description}\n`)
    );

    await ctx.reply(confirmText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Confirm', callback_data: 'CONFIRM_INCOME' }],
          [{ text: '❌ Cancel', callback_data: 'CANCEL_INCOME' }],
        ],
      },
    });
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return;

    const data = ctx.callbackQuery.data;
    await ctx.answerCbQuery();

    if (data === 'CONFIRM_INCOME') {
      try {
        await addIncome(ctx.from!.id, ctx.session.incomesToConfirm);
        await ctx.editMessageText('✅ Income saved.');
        await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
      } catch (err) {
        console.error('Income save error:', err);
        await ctx.reply('❌ Failed to save income. Try again later.');
      }
    } else if (data === 'CANCEL_INCOME') {
      await ctx.editMessageText('❌ Income entry canceled.');
      await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
    }

    return ctx.scene.leave();
  }
);
