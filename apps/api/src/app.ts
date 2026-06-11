import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { AppEnv } from './lib/types';
import { contextMiddleware } from './middleware/context';
import authRoutes from './features/auth';
import projectRoutes from './features/projects';
import conversationRoutes from './features/conversations';
import chatRoutes from './features/chat';

const app = new Hono<AppEnv>();

app.use('/*', async (c, next) => {
  const allowed = [c.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'].filter(Boolean) as string[];
  return cors({
    origin: allowed,
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })(c, next);
});

app.use('/*', contextMiddleware);

app.get('/', (c) => c.json({ status: 'ok' }));

app.route('/auth', authRoutes);
app.route('/projects', projectRoutes);
app.route('/conversations', conversationRoutes);
app.route('/chat', chatRoutes);

export default app;
