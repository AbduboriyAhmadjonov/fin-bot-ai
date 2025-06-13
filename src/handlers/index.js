import startHandler from './startHandler.js';
import settingsHandler from './settingsHandler.js';
import categoryHandler from './categoryHandler.js';
import incomeHandler from './incomeHandler.js';
import expenseHandler from './expenseHandler.js';
import summaryHandler from './summaryHandler.js';
import exportHandler from './exportHandler.js';
import adminHandler from './adminHandler.js';

export default function registerHandlers(bot) {
  startHandler(bot);
  settingsHandler(bot);
  categoryHandler(bot);
  incomeHandler(bot);
  expenseHandler(bot);
  summaryHandler(bot);
  exportHandler(bot);
  adminHandler(bot);
}
