import { createUser, getUserByTelegramId } from '../services/userService.js';
import { addCategory } from '../services/categoriesService.js';

export async function createUserIfNotExisted(ctx) {
  const existing = await getUserByTelegramId(ctx.from.id);

  if (!existing) {
    const newUser = await createUser({
      telegramId: ctx.from.id,
      username: ctx.from.username,
      firstName: ctx.from.message.first_name,
      phoneNumber: ctx.message.contact.phone_number,
    });
  }

  return existing ? existing : newUser;
}

export async function createDefaultCategories(ctx) {
  const user = await createUserIfNotExisted(ctx);

  const defaultCategories = [
    // Expenses
    { name: 'Food & Dining', type: 'expense', isDefault: true },
    { name: 'Transport', type: 'expense', isDefault: true },
    { name: 'Housing', type: 'expense', isDefault: true },
    { name: 'Shopping', type: 'expense', isDefault: true },
    // Incomes
    { name: 'Salary', type: 'income', isDefault: true },
    { name: 'Gift', type: 'income', isDefault: true },
    { name: 'Freelance', type: 'income', isDefault: true },
    { name: 'Investment', type: 'income', isDefault: true },
  ];
}

/* 
model Category {
  name      String
  type      CategoryType
  isDefault Boolean      @default(false)

  userId            String?
  expenses          Expense[]
  income            Income[]
  recurringExpenses RecurringExpense[]
}
*/

// ❓ What category best fits this expense?

/* Category Selection
expense
🍕 Food &Dining
🚗 Transport
🏠 Housing
🛒 Shopping
📦 Other
➕ Add My Own

income
💼 Salary
🎁 Gift
🪙 Freelance
📈 Investment
📦 Other
➕ Add My Own
*/
