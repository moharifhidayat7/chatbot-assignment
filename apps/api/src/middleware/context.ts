import { createMiddleware } from 'hono/factory';
import type { AppEnv } from '../lib/types';
import { getDb } from '../lib/db';

export const contextMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  c.set('db', getDb(c.env.DATABASE_URL));
  await next();
});
