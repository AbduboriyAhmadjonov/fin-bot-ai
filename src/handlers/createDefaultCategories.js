import { createUserIfNotExisted } from '../services/userService.js';
import { addCategory } from '../services/index.js';

export default async function createDefaultCategories(ctx) {
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

  for (const category of defaultCategories) {
    await addCategory({
      userId: user.id,
      name: category.name,
      type: category.type,
      isDefault: category.isDefault,
    });
  }
}
