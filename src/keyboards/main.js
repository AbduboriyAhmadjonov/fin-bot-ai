import { Markup } from 'telegraf';

const keyboard = {
  // Keyboards
  mainMenu: async (t) =>
    Markup.keyboard([
      [
        Markup.button.callback(await t('add_expense'), 'ADD_EXPENSE'), // Add Expense
        Markup.button.callback(await t('add_income'), 'ADD_INCOME'), // Add Income
      ],
      [
        Markup.button.callback(await t('view_summary'), 'VIEW_SUMMARY'), // View Summary
        Markup.button.callback(await t('settings'), 'SETTINGS'), // Settings
      ],
    ]).resize(),

  contactRequest: async (t) =>
    Markup.keyboard([
      [Markup.button.contactRequest(`📱 ${await t('share_phone_number')}`)], // Share Your Phone Number
    ]).resize(),

  cancelKeyboard: async (t) =>
    Markup.keyboard([[`❌ ${await t('cancel')}`]]).resize(), // Cancel

  removeKeyboard: Markup.removeKeyboard(),

  /**
   * Settings Keyboards
   */

  settingsKeyboard: async (t) =>
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          `🌍 ${await t('change_language')}`,
          'CHANGE_LANGUAGE'
        ),
      ], // Change Language
      [
        Markup.button.callback(
          `💵 ${await t('change_currency')}`,
          'CHANGE_CURRENCY'
        ),
      ], // Change Currency
      [
        Markup.button.callback(
          `📂 ${await t('manage_categories')}`,
          'MANAGE_CATEGORIES'
        ),
      ], // Manage Categories
      [
        Markup.button.callback(
          `🗑️ ${await t('delete_account')}`,
          'DELETE_ACCOUNT'
        ),
      ], // Delete Account
      [
        Markup.button.callback(
          `❌ ${await t('close_settings_menu')}`,
          'CLOSE_SETTINGS'
        ),
      ], // Close Settings Menu
    ]).resize(),

  changeLanguageKeyboard: async (t) =>
    Markup.inlineKeyboard([
      [Markup.button.callback("🇺🇿 O'zbekcha", 'LANG_UZ')],
      [Markup.button.callback('🇷🇺 Русский', 'LANG_RU')],
      [Markup.button.callback('🇬🇧 English', 'LANG_EN')],
      [Markup.button.callback(await t('back_to_settings'), 'BACK_TO_SETTINGS')],
    ]).resize(),

  changeCurrencyKeyboard: async (t) =>
    Markup.inlineKeyboard([
      [Markup.button.callback('🇺🇿 UZS', 'CURRENCY_UZS')],
      [Markup.button.callback('🇺🇸 USD', 'CURRENCY_USD')],
      [Markup.button.callback('🇪🇺 EUR', 'CURRENCY_EUR')],
      [Markup.button.callback('🇷🇺 RUB', 'CURRENCY_RUB')],
      [Markup.button.callback(await t('back_to_settings'), 'BACK_TO_SETTINGS')],
    ]).resize(),

  /**
   * Change Category Keyboard
   */

  categoriesKeyboard: async (t) =>
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          `➕ ${await t('add_new_category')}`,
          'ADD_CATEGORY'
        ),
      ],
      [
        Markup.button.callback(
          `📝 ${await t('edit_category')}`,
          'EDIT_CATEGORY'
        ),
      ],
      [
        Markup.button.callback(
          `📄 ${await t('view_all_categories')}`,
          'VIEW_CATEGORY'
        ),
      ],
      [
        Markup.button.callback(
          `❌ ${await t('delete_category')}`,
          'DELETE_CATEGORY'
        ),
      ],
      [Markup.button.callback(await t('back_to_settings'), 'BACK_TO_SETTINGS')],
    ]).resize(),

  backToCategoriesKeyboard: async (t) =>
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          await t('back_to_categories'),
          'BACK_TO_CATEGORIES'
        ),
      ],
    ]).resize(),

  addNewCategoryKeyboard: async (t) =>
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          await t('income_category'),
          'ADD_NEW_INCOME_CATEGORY'
        ),
      ],
      [
        Markup.button.callback(
          await t('expense_category'),
          'ADD_NEW_EXPENSE_CATEGORY'
        ),
      ],
      [
        Markup.button.callback(
          await t('back_to_categories'),
          'BACK_TO_CATEGORIES'
        ),
      ],
    ]).resize(),

  editCategoryKeyboard: async (t) =>
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          await t('income_category'),
          'EDIT_INCOME_CATEGORY'
        ),
      ],
      [
        Markup.button.callback(
          await t('expense_category'),
          'EDIT_EXPENSE_CATEGORY'
        ),
      ],
      [
        Markup.button.callback(
          await t('back_to_categories'),
          'BACK_TO_CATEGORIES'
        ),
      ],
    ]).resize(),

  /**
   * Confirmation Keyboards
   */

  confirmOrCancelExpenses: async (t) =>
    Markup.inlineKeyboard([
      [Markup.button.callback(await t('confirm'), 'CONFIRM_EXPENSES')],
      [Markup.button.callback(await t('cancel'), 'CANCEL_EXPENSES')],
    ]).resize(),

  confirmOrCancelIncomes: async (t) =>
    Markup.inlineKeyboard([
      [Markup.button.callback(await t('confirm'), 'CONFIRM_INCOME')],
      [Markup.button.callback(await t('cancel'), 'CANCEL_INCOME')],
    ]).resize(),

  deleteAccountKeyboard: async (t) =>
    Markup.inlineKeyboard([
      [Markup.button.callback(await t('yes_delete'), 'CONFIRM_DELETE')],
      [Markup.button.callback(await t('cancel'), 'CANCEL_DELETE')],
    ]).resize(),
};

export default keyboard;
