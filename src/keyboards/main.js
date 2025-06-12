import { Markup } from 'telegraf';

const keyboard = {
  // Keyboards
  mainMenu: Markup.keyboard([
    [
      Markup.button.callback('➕💸 Add Expense', 'ADD_EXPENSE'),
      Markup.button.callback('➕💰 Add Income', 'ADD_INCOME'),
    ],
    [
      Markup.button.callback('📊 View Summary', 'VIEW_SUMMARY'),
      Markup.button.callback('⚙️ Settings', 'SETTINGS'),
    ],
  ]).resize(),

  contactRequest: Markup.keyboard([
    [Markup.button.contactRequest('📱 Share Your Phone Number')],
  ]).resize(),

  cancelKeyboard: Markup.keyboard([['❌ Cancel']]).resize(),

  removeKeyboard: Markup.removeKeyboard(),

  /**
   * Settings Keyboards
   */

  settingsKeyboard: Markup.inlineKeyboard([
    [Markup.button.callback('🌍 Change Language', 'CHANGE_LANGUAGE')],
    [Markup.button.callback('💵 Change Currency', 'CHANGE_CURRENCY')],
    [Markup.button.callback('📂 Manage Categories', 'MANAGE_CATEGORIES')],
    [Markup.button.callback('🗑️ Delete Account', 'DELETE_ACCOUNT')],
    [Markup.button.callback('❌ Close Settings Menu', 'CLOSE_SETTINGS')],
  ]).resize(),

  changeLanguageKeyboard: Markup.inlineKeyboard([
    [Markup.button.callback("🇺🇿 O'zbekcha", 'LANG_UZ')],
    [Markup.button.callback('🇷🇺 Русский', 'LANG_RU')],
    [Markup.button.callback('🇬🇧 English', 'LANG_EN')],
    [Markup.button.callback('◀️ Back to Settings', 'BACK_TO_SETTINGS')],
  ]).resize(),

  changeCurrencyKeyboard: Markup.inlineKeyboard([
    [Markup.button.callback('🇺🇿 UZS', 'CURRENCY_UZS')],
    [Markup.button.callback('🇺🇸 USD', 'CURRENCY_USD')],
    [Markup.button.callback('🇪🇺 EUR', 'CURRENCY_EUR')],
    [Markup.button.callback('🇷🇺 RUB', 'CURRENCY_RUB')],
    [Markup.button.callback('◀️ Back to Settings', 'BACK_TO_SETTINGS')],
  ]).resize(),

  /**
   * Change Category Keyboard
   */

  categoriesKeyboard: Markup.inlineKeyboard([
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
