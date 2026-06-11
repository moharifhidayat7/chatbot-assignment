import { Hono } from 'hono';
import type { AppEnv } from '../../lib/types';
import { authMiddleware } from '../../middleware/auth';
import { notFound } from '../../lib/errors';
import { findById, getMessages, remove } from './conversations.service';

const conversations = new Hono<AppEnv>();

conversations.use('/*', authMiddleware);

// GET /conversations/:id/messages
conversations.get('/:id/messages', async (c) => {
  const userId = c.get('userId');
  const conv = await findById(c.req.param('id'), userId);
  if (!conv) return notFound(c);

  return c.json(await getMessages(conv.id));
});

// DELETE /conversations/:id
conversations.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const deleted = await remove(c.req.param('id'), userId);
  return deleted ? c.body(null, 204) : notFound(c);
});

export default conversations;
