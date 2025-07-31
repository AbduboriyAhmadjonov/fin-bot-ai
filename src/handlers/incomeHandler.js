import { Scenes } from 'telegraf';
import keyboard from '../keyboards/main.js';
import { addIncome } from '../services/index.js';

const { WizardScene } = Scenes;

export const incomeScene = new WizardScene(
  'income-wizard',

  /* Step 0 – ask for data */
  async (ctx) => {
    ctx.session.incomesToConfirm = [];
    // await ctx.reply(
    //   '💵 Send your income like:\n`1200000 Salary`\nOr multiple:\n`1200000 Salary, 300000 Freelance`\n\nPress ❌ Cancel to go back.',
    //   keyboard.cancelKeyboard
    // );
    ctx.reply(
      await ctx.t('income.welcome'),
      await keyboard.cancelKeyboard(ctx.t)
    );
    return ctx.wizard.next();
  },

  /* Step 1 – parse & validate */
  async (ctx) => {
    const text = ctx.message?.text;

    if (text === '❌ Cancel') {
      await ctx.reply(
        '❌ Income entry canceled.',
        await keyboard.mainMenu(ctx.t)
      );
      return ctx.scene.leave();
    }

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
      return; // stay on this step
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

  /* Step 2 – wait for inline button */
  async (ctx) => {
    if (!ctx.callbackQuery) return;

    const data = ctx.callbackQuery.data;
    await ctx.answerCbQuery();

    if (data === 'CONFIRM_INCOME') {
      try {
        await addIncome(ctx.from.id.toString(), ctx.session.incomesToConfirm);
        await ctx.editMessageText('✅ Income saved.');
        await ctx.reply(
          await ctx.t('back_to_main_menu'),
          await keyboard.mainMenu(ctx.t)
        );
      } catch (err) {
        console.error('Income save error:', err);
        await ctx.reply('❌ Failed to save income. Try again later.');
      }
    } else if (data === 'CANCEL_INCOME') {
      await ctx.editMessageText('❌ Income entry canceled.');
      await ctx.reply(
        await ctx.t('back_to_main_menu'),
        await keyboard.mainMenu(ctx.t)
      );
    }

    return ctx.scene.leave();
  }
);
