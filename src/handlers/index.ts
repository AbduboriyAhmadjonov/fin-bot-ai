import { Telegraf } from 'telegraf';
import type { BotContext } from '../types.js';

import start from './commands/start.js';
import summaryHandler from './summaryHandler.js';
import contactHandler from './contactHandler.js';

import settingsHandler from './settings/settings.js';
import categoryHandler from './settings/changeCategory.js';
import currencyHandler from './settings/changeCurrency.js';
import languageHandler from './settings/changeLanguage.js';
import deleteAccountHandler from './settings/deleteAccount.js';

import registerAdminLogin from './adminLogin.js';

export default function registerHandlers(bot: Telegraf<BotContext>): void {
  start(bot);
  contactHandler(bot);
  summaryHandler(bot);

  settingsHandler(bot);
  categoryHandler(bot);
  currencyHandler(bot);
  languageHandler(bot);
  deleteAccountHandler(bot);

  registerAdminLogin(bot);
}
