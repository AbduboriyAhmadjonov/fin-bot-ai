import keyboard from '../../keyboards/main.js';

// commands/deleteAccount.js
export default async function deleteAccountHandler(bot) {
  bot.action('DELETE_ACCOUNT', async (ctx) => {
    await ctx.answerCbQuery();
    // const telegramId = ctx.from.id;

    // Confirm intent
    await ctx.editMessageText(
      '⚠️ Are you sure you want to delete your FinBot AI account? This action is irreversible.',
      keyboard.deleteAccountKeyboard
    );
  });

  // Handle confirmation
  bot.action('CONFIRM_DELETE', async (ctx) => {
    await ctx.answerCbQuery();
    // await pool.query('DELETE FROM users WHERE telegram_id = $1', [
    //   ctx.from.id,
    // ]);
    // // Optionally delete expenses too
    // await pool.query('DELETE FROM expenses WHERE user_id = $1', [
    //   ctx.from.id,
    // ]);

    await ctx.editMessageText('🗑️ Your account has been deleted successfully.');
  });

  // Handle cancellation
  bot.action('CANCEL_DELETE', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText('👍 Account deletion cancelled.');
    await ctx.replyWithMarkdown('Settings Menu', keyboard.settingsKeyboard); // extra
  });
}
