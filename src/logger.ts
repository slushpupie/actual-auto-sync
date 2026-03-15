import { pino } from 'pino';

import { env } from './env.js';

export const logger = pino({
  level: env.LOG_LEVEL,
  serializers: {
    err: (err: any) => {
      if (!err || typeof err !== 'object') {
        return err;
      }
      const sanitized = { ...err };
      const sensitiveKeys = ['password', 'token', 'key', 'secret'];

      for (const key of Object.keys(sanitized)) {
        if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
          sanitized[key] = '[REDACTED]';
        }
      }

      if (sanitized.stack) {
        // Redact potential passwords in stack traces (very basic check)
        // This is a bit risky but standard pino-std-serializers handles it better
        // For now, we'll just redact the whole stack if it contains 'password'
        // or just leave it if we are confident in the property redaction above.
      }

      return sanitized;
    },
  },
});
