import startCommand from './commands/start.js';
import helpCommand from './commands/help.js';
import settingsCommand from './commands/settings.js';

import addExpenseHandler from './handlers/addExpense.js';
import addIncomeHandler from './handlers/addIncome.js';
import {
  handleExpenseInput,
  handleIncomeInput,
} from './handlers/handleInput.js';

import settingsHandler from './handlers/settings/settings.js';
import contactHandler from './handlers/contact.js';
import { languageHandler } from './handlers/settings/language.js';
import { currencyHandler } from './handlers/settings/currency.js';
import deleteAccountHandler from './handlers/settings/deleteAccaunt.js';

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
  deleteAccountHandler(bot);

  // Single text handler
  bot.on('text', async (ctx) => {
    if (!ctx.session?.state) return;

    if (ctx.session.state === 'awaiting_income') {
      return handleIncomeInput(ctx);
    } else if (ctx.session.state === 'awaiting_expense') {
      return handleExpenseInput(ctx);
    }
  });
}
