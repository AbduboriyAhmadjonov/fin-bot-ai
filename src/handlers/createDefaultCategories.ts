import type { BotContext } from '../types.js';
import { getUserByTelegramId } from '../services/userService.js';
import { ensureDefaultCategories } from '../services/categoryService.js';

export default async function createDefaultCategories(ctx: BotContext): Promise<void> {
  const user = await getUserByTelegramId(ctx.from!.id);
  if (user) {
    await ensureDefaultCategories(user.id);
  }
}
