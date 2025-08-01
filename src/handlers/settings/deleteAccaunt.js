import keyboard from '../../keyboards/main.js';
import { deleteUser } from '../../services/userService.js';

/**
 * Handler for account deletion functionality
 * Allows users to permanently delete their account after confirmation
 */
export default async function deleteAccountHandler(bot) {
  bot.action('DELETE_ACCOUNT', async (ctx) => {
    await ctx.answerCbQuery();

    // Confirm intent with localized message
    const confirmMessage =
      (await ctx.t('delete_account_confirm')) ||
      '⚠️ Are you sure you want to delete your FinBot AI account? This action is irreversible.';

    await ctx.editMessageText(
      confirmMessage,
      await keyboard.deleteAccountKeyboard(ctx.t)
    );
  });

  // Handle confirmation
  bot.action('CONFIRM_DELETE', async (ctx) => {
    await ctx.answerCbQuery();
    try {
      // The deleteUser function will either return the deleted user or throw an error
      await deleteUser(ctx.from.id);

      // If we get here, the deletion was successful
      const successMessage =
        (await ctx.t('account_deleted_success')) ||
        '🗑️ Your account has been deleted successfully.';

      await ctx.editMessageText(successMessage);
    } catch (error) {
      console.error(`Account deletion error for user ${ctx.from.id}:`, error);

      const errorMessage =
        (await ctx.t('account_deletion_error')) ||
        '❌ An error occurred while deleting your account. Please try again later.';

      await ctx.editMessageText(errorMessage);
    }
  });

  // Handle cancellation
  bot.action('CANCEL_DELETE', async (ctx) => {
    await ctx.answerCbQuery();

    const cancelMessage =
      (await ctx.t('account_deletion_cancelled')) ||
      '👍 Account deletion cancelled.';

    await ctx.editMessageText(cancelMessage);
    await ctx.replyWithMarkdown(
      await ctx.t('back_to_settings'),
      await keyboard.settingsKeyboard(ctx.t)
    );
  });
}
