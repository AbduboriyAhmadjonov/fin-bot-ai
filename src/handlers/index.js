import startHandler from './commands/startHandler.js';
import incomeHandler from './incomeHandler.js';
import expenseHandler from './expenseHandler.js';
import contactHandler from './contactHandler.js';

// Settings handlers
import settingsHandler from './settings/settings.js';
import categoryHandler from './settings/changeCategory.js';
import currencyHandler from './settings/changeCurrency.js';
import languageHandler from './settings/changeLanguage.js';
import deleteAccountHandler from './settings/deleteAccaunt.js';

// Admin
import registerAdminLogin from './adminLogin.js';

export default function registerHandlers(bot) {
  startHandler(bot);
  incomeHandler(bot);
  expenseHandler(bot);
  contactHandler(bot);

  // Settings
  settingsHandler(bot);
  categoryHandler(bot);
  currencyHandler(bot);
  languageHandler(bot);
  deleteAccountHandler(bot);

  // Admin
  registerAdminLogin(bot);
}
