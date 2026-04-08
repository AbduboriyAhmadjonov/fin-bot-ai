import pino from 'pino';

const logger = (pino as unknown as typeof pino.default)({
  level: process.env.LOG_LEVEL || 'info',
});

export default logger;
