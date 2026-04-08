import { Telegraf } from 'telegraf';
import type { BotContext } from '../../types.js';
import keyboard from '../../keyboards/main.js';
import { changeLanguage } from '../../services/settingsService.js';
import { safe } from '../../utils.js';

export default async function languageHandler(bot: Telegraf<BotContext>): Promise<void> {
  bot.action('CHANGE_LANGUAGE', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please select your preferred language:',
      keyboard.changeLanguageKeyboard
    );
  });

  bot.action('LANG_EN', safe(async (ctx) => {
    await changeLanguage(ctx.from!.id, 'en');
    ctx.setLang('en');
    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ Language updated to English 🇬🇧');
    await ctx.reply('Back to Settings', keyboard.settingsKeyboard);
  }));

  bot.action('LANG_RU', safe(async (ctx) => {
    await changeLanguage(ctx.from!.id, 'ru');
    ctx.setLang('ru');
    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ Язык обновлен на русский 🇷🇺');
    await ctx.reply('Back to Settings', keyboard.settingsKeyboard);
  }));

  bot.action('LANG_UZ', safe(async (ctx) => {
    await changeLanguage(ctx.from!.id, 'uz');
    ctx.setLang('uz');
    await ctx.answerCbQuery();
    await ctx.editMessageText("✅ Til o'zbek tiliga o'zgartirildi 🇺🇿");
    await ctx.reply('Back to Settings', keyboard.settingsKeyboard);
  }));
}
