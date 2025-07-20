import { Scenes } from 'telegraf';
import { expenseScene } from '../handlers/expenseHandler.js';
import { incomeScene } from '../handlers/incomeHandler.js';
// import { settingsScene } from '../scenes/settingsWizard.js';
// import { adminLoginScene } from '../scenes/adminLoginWizard.js';

const stage = new Scenes.Stage([
  expenseScene,
  incomeScene,
  // settingsScene,
  // adminLoginScene,
]);

export default stage;
