import startCommand from './commands/start.js';
import helpCommand from './commands/help.js';
import settingsCommand from './commands/settings.js';

import addExpenseHandler from './handlers/addExpense.js';
import addIncomeHandler from './handlers/addIncome.js';
import {
  handleExpenseInput,
  handleIncomeInput,
} from './handlers/handleInput.js';

import contactHandler from './handlers/contact.js';

import settingsHandler from './handlers/settings/settings.js';
import { languageHandler } from './handlers/settings/language.js';
import { currencyHandler } from './handlers/settings/currency.js';
import { categoriesHandler } from './handlers/settings/categories.js';
import deleteAccountHandler from './handlers/settings/deleteAccaunt.js';

import { addCategory } from './services/categoriesService.js';

export default function register(bot) {
  // Commands
  startCommand(bot);
  helpCommand(bot);
  settingsCommand(bot);

  // Handlers
  contactHandler(bot);
  addExpenseHandler(bot);
  addIncomeHandler(bot);
  settingsHandler(bot);
  languageHandler(bot);
  currencyHandler(bot);
  categoriesHandler(bot);
  deleteAccountHandler(bot);

  // Single text handler
  bot.on('text', async (ctx) => {
    const { state } = ctx.session ?? {};
    if (!state) return;

    const userId = ctx.from.id;

    switch (state) {
      case 'awaiting_income_category_name': {
        const name = ctx.message.text;
        try {
          await addCategory({
            telegramId: ctx.from.id,
            name,
            type: 'income',
          });
          ctx.session.state = null;
          await ctx.reply(`✅ Income category *${name}* added successfully!`);
        } catch (err) {
          console.error(err);
          await ctx.reply('❌ Failed to add category.');
        }
      }
      case 'awaiting_expense_category_name': {
        const name = ctx.message.text;
        try {
          await addCategory({
            telegramId: ctx.from.id,
            name,
            type: 'expense',
          });
          ctx.session.state = null;
          await ctx.reply(`✅ Expense category *${name}* added successfully!`);
        } catch (err) {
          console.error(err);
          await ctx.reply('❌ Failed to add category.');
        }
      }
      case 'awaiting_income':
        await handleIncomeInput(ctx);
        break;
      case 'awaiting_expense':
        await handleExpenseInput(ctx);
        break;
      case 'awaiting_income_category':
        await addCategory({
          userId,
          name: ctx.message.text,
          type: 'income',
        });
        await ctx.reply(
          `✅ Income category "${ctx.message.text}" added successfully.`
        );
        break;

      case 'awaiting_expense_category':
        await addCategory({
          userId,
          name: ctx.message.text,
          type: 'expense',
        });
        await ctx.reply(
          `✅ Expense category "${ctx.message.text}" added successfully.`
        );
        break;

      case 'awaiting_edit_income_category':
        // Placeholder for edit logic
        await ctx.reply('✏️ Editing income categories is coming soon...');
        break;

      case 'awaiting_edit_expense_category':
        // Placeholder for edit logic
        await ctx.reply('✏️ Editing expense categories is coming soon...');
        break;

      default:
        await ctx.reply('🤖 Unknown action. Please start again.');
    }

    ctx.session.state = null;
  });
}
