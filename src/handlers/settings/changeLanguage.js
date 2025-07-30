import keyboard from '../../keyboards/main.js';

export default async function languageHandler(bot) {
  bot.action('CHANGE_LANGUAGE', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please select your preferred language:',
      keyboard.changeLanguageKeyboard
    );
  });

  bot.action('LANG_EN', async (ctx) => {
    ctx.setLang('en'); // updates i18n and session
    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ Language updated to English 🇬🇧');
    await ctx.replyWithMarkdown('Back to Settings', keyboard.settingsKeyboard);
  });

  bot.action('LANG_RU', async (ctx) => {
    ctx.setLang('ru');
    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ Язык обновлен на русский 🇷🇺');
    await ctx.replyWithMarkdown('Back to Settings', keyboard.settingsKeyboard);
  });

  bot.action('LANG_UZ', async (ctx) => {
    ctx.setLang('uz');
    await ctx.answerCbQuery();
    await ctx.editMessageText("✅ Til o'zbek tiliga o'zgartirildi 🇺🇿");
    await ctx.replyWithMarkdown('Back to Settings', keyboard.settingsKeyboard);
  });
}
