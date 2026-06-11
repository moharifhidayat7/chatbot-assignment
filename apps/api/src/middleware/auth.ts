import { createMiddleware } from 'hono/factory';
import type { AppEnv } from '../lib/types';
import { verifyAccessToken } from '../features/auth/auth.service';

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  const token = header.slice(7);
  const payload = await verifyAccessToken(token, c.env.JWT_SECRET);
  if (!payload) {
    return c.json({ message: 'Invalid or expired token' }, 401);
  }

  c.set('userId', payload.userId);
  await next();
});
