export default function errorBoundary(logger) {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      logger.error(err);
      try {
        await ctx.reply('❌ An unexpected error occurred.');
      } catch (_) {}
    }
  };
}
