import keyboard from '../../keyboards/main.js';
import {
  addCategory,
  deleteCategory,
  viewCategories,
} from '../../services/categoryService.js';

export default async function categoryHandler(bot) {
  bot.action('MANAGE_CATEGORIES', async (ctx) => {
    ctx.session ??= {};
    ctx.session.state = 'awaiting_category_action';

    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please select the action you want to perform:',
      keyboard.categoriesKeyboard
    );
  });

  bot.action('BACK_TO_CATEGORIES', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please select the action you want to perform:',
      keyboard.categoriesKeyboard
    );
  });

  /** Add New Category */

  bot.action('ADD_CATEGORY', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please choose the type of category:',
      keyboard.addNewCategoryKeyboard
    );
  });

  bot.action('ADD_NEW_INCOME_CATEGORY', async (ctx) => {
    ctx.session ??= {};
    ctx.session.state = 'awaiting_income_category_name';
    await ctx.answerCbQuery();
    await ctx.editMessageText('Send the name for the new *income* category:');
  });

  bot.action('ADD_NEW_EXPENSE_CATEGORY', async (ctx) => {
    ctx.session ??= {};
    ctx.session.state = 'awaiting_expense_category_name';
    await ctx.answerCbQuery();
    await ctx.editMessageText('Send the name for the new *expense* category:');
  });

  /** Edit Category */
  bot.action('EDIT_CATEGORY', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText('Please select the type of category:');
  });

  bot.action('EDIT_INCOME_CATEGORY', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please send the name of the income category to edit:'
    );
    ctx.session.state = 'awaiting_edit_income_category';
  });

  bot.action('EDIT_EXPENSE_CATEGORY', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please send the name of the expense category to edit:'
    );
    ctx.session.state = 'awaiting_edit_expense_category';
  });

  /** View All Categories */

  bot.action('VIEW_CATEGORY', async (ctx) => {
    await ctx.answerCbQuery();

    const userId = ctx.from.id;

    const incomeCategories = await viewCategories({ userId, type: 'income' });
    const expenseCategories = await viewCategories({ userId, type: 'expense' });

    let message = '📂 *Your Categories*\n\n';

    if (incomeCategories.length > 0) {
      message += '🟢 *Income Categories:*\n';
      incomeCategories.forEach((cat, i) => {
        message += `  ${i + 1}. ${cat.name}\n`;
      });
    } else {
      message += '🟢 *Income Categories:* _None_\n';
    }

    message += '\n';

    if (expenseCategories.length > 0) {
      message += '🔴 *Expense Categories:*\n';
      expenseCategories.forEach((cat, i) => {
        message += `  ${i + 1}. ${cat.name}\n`;
      });
    } else {
      message += '🔴 *Expense Categories:* _None_\n';
    }

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard.backToCategoriesKeyboard.reply_markup,
    });
  });

  /** Delete Category */

  bot.action('DELETE_CATEGORY', async (ctx) => {
    await ctx.answerCbQuery();

    const categories = await viewCategories({
      userId: ctx.from.id,
      type: 'expense', // or 'income' if you want both
    });

    if (!categories.length) {
      return await ctx.editMessageText('No categories to delete.');
    }

    const buttons = categories.map((cat) => [
      {
        text: cat.name,
        callback_data: `DELETE_CATEGORY_${cat.id}`,
      },
    ]);

    await ctx.editMessageText('Select a category to delete:', {
      reply_markup: { inline_keyboard: buttons },
    });
  });

  bot.action(/^DELETE_CATEGORY_(.+)$/, async (ctx) => {
    const categoryId = ctx.match[1];
    await ctx.answerCbQuery();

    try {
      await deleteCategory({ categoryId });
      await ctx.editMessageText('✅ Category deleted successfully.');
    } catch (err) {
      console.error(err);
      await ctx.editMessageText('❌ Failed to delete category.');
    }
  });
}
