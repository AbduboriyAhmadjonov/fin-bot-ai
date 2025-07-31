import keyboard from '../../keyboards/main.js';
import { changeLanguage } from '../../services/settingsService.js';

export default async function languageHandler(bot) {
  bot.action('CHANGE_LANGUAGE', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      await ctx.t('preferred_language'),
      await keyboard.changeLanguageKeyboard(ctx.t)
    );
  });

  bot.action('LANG_EN', async (ctx) => {
    ctx.setLang('en');
    const newLanguage = await changeLanguage(ctx.from.id, 'en');
    console.log(`Language changed to: ${newLanguage}`);
    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ Language updated to English 🇬🇧');
    await ctx.replyWithMarkdown(
      await ctx.t('back_to_settings'),
      await keyboard.settingsKeyboard(ctx.t)
    );
  });

  bot.action('LANG_RU', async (ctx) => {
    ctx.setLang('ru');
    const newLanguage = await changeLanguage(ctx.from.id, 'ru');
    console.log(`Language changed to: ${newLanguage}`);
    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ Язык обновлен на русский 🇷🇺');
    await ctx.replyWithMarkdown(
      await ctx.t('back_to_settings'),
      await keyboard.settingsKeyboard(ctx.t)
    );
  });

  bot.action('LANG_UZ', async (ctx) => {
    ctx.setLang('uz');
    const newLanguage = await changeLanguage(ctx.from.id, 'uz');
    console.log(`Language changed to: ${newLanguage}`);
    await ctx.answerCbQuery();
    await ctx.editMessageText("✅ Til o'zbek tiliga o'zgartirildi 🇺🇿");
    await ctx.replyWithMarkdown(
      await ctx.t('back_to_settings'),
      await keyboard.settingsKeyboard(ctx.t)
    );
  });
}
