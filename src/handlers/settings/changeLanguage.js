import keyboard from '../../keyboards/main.js';
import { changeLanguage } from '../../services/settingsService.js';

export default async function languageHandler(bot) {
  bot.action('CHANGE_LANGUAGE', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please select your preferred language:',
      keyboard.changeLanguageKeyboard
    );
  });

  bot.action('LANG_EN', async (ctx) => {
    await ctx.answerCbQuery();
    await changeLanguage(ctx.from.id, 'en');
    await ctx.editMessageText('✅ Language updated to English 🇬🇧');
    await ctx.replyWithMarkdown('Back to Settings', keyboard.settingsKeyboard);
  });

  bot.action('LANG_RU', async (ctx) => {
    await ctx.answerCbQuery();
    await changeLanguage(ctx.from.id, 'ru');
    await ctx.editMessageText('✅ Язык обновлен на русский 🇷🇺');
    await ctx.replyWithMarkdown('Back to Settings', keyboard.settingsKeyboard);
  });

  bot.action('LANG_UZ', async (ctx) => {
    await ctx.answerCbQuery();
    await changeLanguage(ctx.from.id, 'uz');
    await ctx.editMessageText("✅ Til o'zbek tiliga o'zgartirildi 🇺🇿");
    await ctx.replyWithMarkdown('Back to Settings', keyboard.settingsKeyboard);
  });
}
