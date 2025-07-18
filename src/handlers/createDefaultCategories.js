import { getOrCreateUser } from '../services/userService.js';
import { ensureDefaultCategories } from '../services/categoryService.js';

export default async function createDefaultCategories(ctx) {
  const user = await getOrCreateUser(ctx.from.id.toString());
  await ensureDefaultCategories(user.id);
}

/**
  ,
  name,
  type,
  isDefault = false,
 */
