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
    // TODO Delete
    await ctx.editMessageText('🗑️ Your account has been deleted successfully.');
  });

  // Handle cancellation
  bot.action('CANCEL_DELETE', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText('👍 Account deletion cancelled.');
    await ctx.replyWithMarkdown('Back to Settings', keyboard.settingsKeyboard); // extra
  });
}
