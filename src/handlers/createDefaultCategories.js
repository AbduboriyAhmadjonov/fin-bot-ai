import { getUserByTelegramId } from '../services/userService.js';
import { ensureDefaultCategories } from '../services/categoryService.js';

export default async function createDefaultCategories(ctx) {
  const user = await getUserByTelegramId(ctx.from.id.toString());
  await ensureDefaultCategories(user.id);
}
