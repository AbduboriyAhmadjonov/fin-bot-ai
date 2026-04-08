import { Telegraf } from 'telegraf';
import type { BotContext } from '../../types.js';
import keyboard from '../../keyboards/main.js';
import { deleteUser } from '../../services/userService.js';

export default async function deleteAccountHandler(bot: Telegraf<BotContext>): Promise<void> {
  bot.action('DELETE_ACCOUNT', async (ctx) => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(
      '⚠️ Are you sure you want to delete your FinBot AI account? This action is irreversible.',
      keyboard.deleteAccountKeyboard
    );
  });

  bot.action('CONFIRM_DELETE', async (ctx) => {
    await ctx.answerCbQuery();
    try {
      await deleteUser(ctx.from!.id);
      await ctx.editMessageText('🗑️ Your account has been deleted successfully.');
    } catch (err) {
      console.error('Delete account error:', err);
      await ctx.editMessageText('❌ Failed to delete account. Please try again.');
    }
  });

  bot.action('CANCEL_DELETE', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText('👍 Account deletion cancelled.');
    await ctx.replyWithMarkdownV2('Back to Settings', keyboard.settingsKeyboard);
  });
}
