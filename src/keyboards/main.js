import { Markup } from 'telegraf';

const keyboard = {
  // Keyboards
  mainMenu: async (t) =>
    Markup.keyboard([
      [
        Markup.button.callback(`➕💸 ${await t('add_expense')}`, 'ADD_EXPENSE'), // Add Expense
        Markup.button.callback(`➕💰 ${await t('add_income')}`, 'ADD_INCOME'), // Add Income
      ],
      [
        Markup.button.callback(`📊 ${await t('view_summary')}`, 'VIEW_SUMMARY'), // View Summary
        Markup.button.callback(`⚙️ ${await t('settings')}`, 'SETTINGS'), // Settings
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
      [
        Markup.button.callback(
          `◀️ ${await t('back_to_settings')}`,
          'BACK_TO_SETTINGS'
        ),
      ], // Back to Settings
    ]).resize(),

  changeCurrencyKeyboard: async (t) =>
    Markup.inlineKeyboard([
      [Markup.button.callback('🇺🇿 UZS', 'CURRENCY_UZS')],
      [Markup.button.callback('🇺🇸 USD', 'CURRENCY_USD')],
      [Markup.button.callback('🇪🇺 EUR', 'CURRENCY_EUR')],
      [Markup.button.callback('🇷🇺 RUB', 'CURRENCY_RUB')],
      [
        Markup.button.callback(
          `◀️ ${await t('back_to_settings')}`,
          'BACK_TO_SETTINGS'
        ),
      ], // Back to Settings
    ]).resize(),

  /**
   * Change Category Keyboard
   */

  categoriesKeyboard: async (t) =>
    Markup.inlineKeyboard([
      [Markup.button.callback('➕ Add New Category', 'ADD_CATEGORY')],
      [Markup.button.callback('📝 Edit Category', 'EDIT_CATEGORY')],
      [Markup.button.callback('📄 View All Categories', 'VIEW_CATEGORY')],
      [Markup.button.callback('❌ Delete Category', 'DELETE_CATEGORY')],
      [Markup.button.callback('◀️ Back to Settings', 'BACK_TO_SETTINGS')],
    ]).resize(),

  backToCategoriesKeyboard: Markup.inlineKeyboard([
    [Markup.button.callback('◀️ Back to Categories', 'BACK_TO_CATEGORIES')],
  ]).resize(),

  addNewCategoryKeyboard: Markup.inlineKeyboard([
    [Markup.button.callback('🟢 Income Category', 'ADD_NEW_INCOME_CATEGORY')],
    [Markup.button.callback('🔴 Expense Category', 'ADD_NEW_EXPENSE_CATEGORY')],
    [Markup.button.callback('◀️ Back to Categories', 'BACK_TO_CATEGORIES')],
  ]).resize(),

  editCategoryKeyboard: Markup.inlineKeyboard([
    [Markup.button.callback('🟢 Income Category', 'EDIT_INCOME_CATEGORY')],
    [Markup.button.callback('🔴 Expense Category', 'EDIT_EXPENSE_CATEGORY')],
    [Markup.button.callback('◀️ Back to Categories', 'BACK_TO_CATEGORIES')],
  ]).resize(),

  editCategoryKeyboard: Markup.inlineKeyboard([
    [Markup.button.callback('🟢 Income Category', 'EDIT_INCOME_CATEGORY')],
    [Markup.button.callback('🔴 Expense Category', 'EDIT_EXPENSE_CATEGORY')],
    [Markup.button.callback('◀️ Back to Categories', 'BACK_TO_SETTINGS')],
  ]).resize(),

  editCategoryKeyboard: Markup.inlineKeyboard([
    [Markup.button.callback('🟢 Income Category', 'EDIT_INCOME_CATEGORY')],
    [Markup.button.callback('🔴 Expense Category', 'EDIT_EXPENSE_CATEGORY')],
    [Markup.button.callback('◀️ Back to Categories', 'BACK_TO_SETTINGS')],
  ]).resize(),

  /**
   * Confirmation Keyboards
   */

  confirmOrCancelExpenses: Markup.inlineKeyboard([
    [Markup.button.callback('✅ Confirm', 'CONFIRM_EXPENSES')],
    [Markup.button.callback('❌ Cancel', 'CANCEL_EXPENSES')],
  ]).resize(),

  confirmOrCancelIncomes: Markup.inlineKeyboard([
    [Markup.button.callback('✅ Confirm', 'CONFIRM_INCOME')],
    [Markup.button.callback('❌ Cancel', 'CANCEL_INCOME')],
  ]).resize(),

  deleteAccountKeyboard: Markup.inlineKeyboard([
    [Markup.button.callback('✅ Yes, delete', 'CONFIRM_DELETE')],
    [Markup.button.callback('❌ Cancel', 'CANCEL_DELETE')],
  ]).resize(),
};

export default keyboard;
