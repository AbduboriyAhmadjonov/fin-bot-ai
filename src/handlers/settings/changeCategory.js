import keyboard from '../../keyboards/main.js';
import {
  addCategory,
  deleteCategory,
  viewCategories,
  updateCategory,
  getCategoryById,
} from '../../services/categoryService.js';

export default async function categoryHandler(bot) {
  bot.action('MANAGE_CATEGORIES', async (ctx) => {
    ctx.session ??= {};
    ctx.session.state = 'awaiting_category_action';

    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please select the action you want to perform:',
      await keyboard.categoriesKeyboard(ctx.t)
    );
  });

  bot.action('BACK_TO_CATEGORIES', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please select the action you want to perform:',
      await keyboard.categoriesKeyboard(ctx.t)
    );
  });

  /** Add New Category */

  bot.action('ADD_CATEGORY', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please choose the type of category:',
      await keyboard.addNewCategoryKeyboard(ctx.t)
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
    await ctx.editMessageText(
      (await ctx.t('select_category_type_to_edit')) ||
        'Please select the type of category:',
      await keyboard.editCategoryKeyboard(ctx.t)
    );
  });

  bot.action('EDIT_INCOME_CATEGORY', async (ctx) => {
    await ctx.answerCbQuery();

    const categories = await viewCategories({
      userId: ctx.from.id,
      type: 'income',
    });

    if (!categories.length) {
      return await ctx.editMessageText(
        (await ctx.t('no_income_categories')) ||
          "You don't have any income categories to edit.",
        await keyboard.backToCategoriesKeyboard(ctx.t)
      );
    }

    // Create inline keyboard with all income categories
    const buttons = categories.map((cat) => [
      {
        text: cat.name,
        callback_data: `EDIT_CATEGORY_${cat.id}`,
      },
    ]);

    // Add back button
    buttons.push([
      {
        text: (await ctx.t('back_to_categories')) || '🔙 Back to Categories',
        callback_data: 'BACK_TO_CATEGORIES',
      },
    ]);

    await ctx.editMessageText(
      (await ctx.t('select_income_category_to_edit')) ||
        'Select an income category to edit:',
      {
        reply_markup: { inline_keyboard: buttons },
      }
    );
  });

  bot.action('EDIT_EXPENSE_CATEGORY', async (ctx) => {
    await ctx.answerCbQuery();

    const categories = await viewCategories({
      userId: ctx.from.id,
      type: 'expense',
    });

    if (!categories.length) {
      return await ctx.editMessageText(
        (await ctx.t('no_expense_categories')) ||
          "You don't have any expense categories to edit.",
        await keyboard.backToCategoriesKeyboard(ctx.t)
      );
    }

    // Create inline keyboard with all expense categories
    const buttons = categories.map((cat) => [
      {
        text: cat.name,
        callback_data: `EDIT_CATEGORY_${cat.id}`,
      },
    ]);

    // Add back button
    buttons.push([
      {
        text: (await ctx.t('back_to_categories')) || '🔙 Back to Categories',
        callback_data: 'BACK_TO_CATEGORIES',
      },
    ]);

    await ctx.editMessageText(
      (await ctx.t('select_expense_category_to_edit')) ||
        'Select an expense category to edit:',
      {
        reply_markup: { inline_keyboard: buttons },
      }
    );
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
      reply_markup: await keyboard.backToCategoriesKeyboard(ctx.t),
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
      await ctx.editMessageText(
        (await ctx.t('category_deleted_success')) ||
          '✅ Category deleted successfully.',
        await keyboard.backToCategoriesKeyboard(ctx.t)
      );
    } catch (err) {
      console.error(err);
      await ctx.editMessageText(
        (await ctx.t('category_delete_error')) ||
          '❌ Failed to delete category.',
        await keyboard.backToCategoriesKeyboard(ctx.t)
      );
    }
  });

  // Handler for selecting a category to edit
  bot.action(/^EDIT_CATEGORY_(.+)$/, async (ctx) => {
    const categoryId = ctx.match[1];
    await ctx.answerCbQuery();

    try {
      const category = await getCategoryById(categoryId);
      if (!category) {
        return await ctx.editMessageText(
          (await ctx.t('category_not_found')) || '❌ Category not found.',
          await keyboard.backToCategoriesKeyboard(ctx.t)
        );
      }

      // Store the category ID in session for the next step
      ctx.session.editingCategoryId = categoryId;
      ctx.session.state = 'awaiting_new_category_name';

      await ctx.editMessageText(
        (await ctx.t('enter_new_category_name')) ||
          `Please enter a new name for the category "${category.name}":`
      );
    } catch (err) {
      console.error(err);
      await ctx.editMessageText(
        (await ctx.t('category_edit_error')) || '❌ Failed to edit category.',
        await keyboard.backToCategoriesKeyboard(ctx.t)
      );
    }
  });

  // Text handler for category rename
  bot.on('text', async (ctx, next) => {
    if (
      ctx.session?.state !== 'awaiting_new_category_name' ||
      !ctx.session?.editingCategoryId
    ) {
      return next();
    }

    const newName = ctx.message.text.trim();

    // Validate the new name
    if (!newName || newName.length < 1 || newName.length > 50) {
      await ctx.reply(
        (await ctx.t('invalid_category_name')) ||
          '❌ Invalid category name. Please enter a name between 1 and 50 characters.'
      );
      return;
    }

    try {
      const category = await updateCategory({
        categoryId: ctx.session.editingCategoryId,
        name: newName,
      });

      await ctx.reply(
        (await ctx.t('category_renamed_success')) ||
          `✅ Category successfully renamed to "${category.name}".`,
        await keyboard.backToCategoriesKeyboard(ctx.t)
      );

      // Reset session state
      delete ctx.session.editingCategoryId;
      delete ctx.session.state;
    } catch (err) {
      console.error(err);
      await ctx.reply(
        (await ctx.t('category_rename_error')) ||
          '❌ Failed to rename category. Please try again.',
        await keyboard.backToCategoriesKeyboard(ctx.t)
      );
    }
  });
}
