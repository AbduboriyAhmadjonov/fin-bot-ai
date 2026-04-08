import { Scenes } from 'telegraf';
import { expenseScene } from '../handlers/expenseHandler.js';
import { incomeScene } from '../handlers/incomeHandler.js';
import type { BotContext } from '../types.js';

const stage = new Scenes.Stage<BotContext>([
  expenseScene,
  incomeScene,
]);

export default stage;
