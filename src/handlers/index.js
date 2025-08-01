import start from './commands/start.js';
import contactHandler from './contactHandler.js';

// Settings handlers
import settingsHandler from './settings/settings.js';
import categoryHandler from './settings/changeCategory.js';
import currencyHandler from './settings/changeCurrency.js';
import languageHandler from './settings/changeLanguage.js';
import deleteAccountHandler from './settings/deleteAccaunt.js';

// Admin
import registerAdminLogin from './adminLoginNew.js';

// Voice processing
import {
  handleVoiceMessage,
  handleVoiceExpenseCallback,
  handleVoiceIncomeCallback,
  handleVoiceCancelCallback,
} from './voiceHandler.js';

export default function registerHandlers(bot) {
  start(bot);
  contactHandler(bot);

  // Settings
  settingsHandler(bot);
  categoryHandler(bot);
  currencyHandler(bot);
  languageHandler(bot);
  deleteAccountHandler(bot);

  // Voice message handling
  bot.on('voice', handleVoiceMessage);
  bot.action(/voice_expense:(.+)/, handleVoiceExpenseCallback);
  bot.action(/voice_income:(.+)/, handleVoiceIncomeCallback);
  bot.action('cancel_voice', handleVoiceCancelCallback);

  // Admin
  registerAdminLogin(bot);
}
