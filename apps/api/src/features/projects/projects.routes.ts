import { Hono } from 'hono';
import type { AppEnv } from '../../lib/types';
import { authMiddleware } from '../../middleware/auth';
import { notFound, badRequest } from '../../lib/errors';
import { findAllByUser, findById, create, update, remove } from './projects.service';
import { findByProject, create as createConversation } from '../conversations/conversations.service';

const projects = new Hono<AppEnv>();

projects.use('/*', authMiddleware);

// GET /projects
projects.get('/', async (c) => {
  const userId = c.get('userId');
  return c.json(await findAllByUser(userId));
});

// POST /projects
projects.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<{ name?: string; systemPrompt?: string; scopeEnforced?: boolean }>();

  if (!body.name || !body.systemPrompt) {
    return badRequest(c, 'name and systemPrompt are required');
  }

  const project = await create(userId, { name: body.name, systemPrompt: body.systemPrompt, scopeEnforced: body.scopeEnforced });
  return c.json(project, 201);
});

// GET /projects/:id
projects.get('/:id', async (c) => {
  const userId = c.get('userId');
  const project = await findById(c.req.param('id'), userId);
  return project ? c.json(project) : notFound(c);
});

// PATCH /projects/:id
projects.patch('/:id', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<{ name?: string; systemPrompt?: string; scopeEnforced?: boolean }>();
  const updated = await update(c.req.param('id'), userId, body);
  return updated ? c.json(updated) : notFound(c);
});

// DELETE /projects/:id
projects.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const deleted = await remove(c.req.param('id'), userId);
  return deleted ? c.body(null, 204) : notFound(c);
});

// GET /projects/:projectId/conversations
projects.get('/:projectId/conversations', async (c) => {
  const userId = c.get('userId');
  const convs = await findByProject(c.req.param('projectId'), userId);
  return c.json(convs);
});

// POST /projects/:projectId/conversations
projects.post('/:projectId/conversations', async (c) => {
  const userId = c.get('userId');
  const conv = await createConversation(c.req.param('projectId'), userId);
  return c.json(conv, 201);
});

export default projects;
