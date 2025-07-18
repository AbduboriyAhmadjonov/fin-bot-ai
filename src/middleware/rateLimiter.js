const buckets = new Map();

export default function rateLimiter({ windowMs = 1000, limit = 5 } = {}) {
  return async (ctx, next) => {
    const id = ctx.from?.id;
    if (!id) return next();
    const now = Date.now();
    const bucket = buckets.get(id) || { count: 0, start: now };
    if (now - bucket.start > windowMs) {
      bucket.count = 0;
      bucket.start = now;
    }
    bucket.count += 1;
    buckets.set(id, bucket);
    if (bucket.count > limit) {
      return ctx.reply('⏳ Please slow down.');
    }
    await next();
  };
}
