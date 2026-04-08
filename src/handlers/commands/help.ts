import { Telegraf } from 'telegraf';
import type { BotContext } from '../../types.js';

export default async function helpCommand(bot: Telegraf<BotContext>): Promise<void> {
  bot.command('help', async (ctx) => {
    await ctx.reply(`
How can I help you?
If you need assistance, please contact us.
Telegram: https://t.me/abduboriy05
Website: https://abduboriy.tech
`);
  });
}
