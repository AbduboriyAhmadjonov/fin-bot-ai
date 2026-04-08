import { Telegraf } from 'telegraf';
import type { BotContext } from '../../types.js';
import keyboard from '../../keyboards/main.js';

export default async function settingsCommand(bot: Telegraf<BotContext>): Promise<void> {
  bot.command('settings', (ctx) => {
    ctx.reply('What would you like to do?', keyboard.settingsKeyboard);
  });
}
