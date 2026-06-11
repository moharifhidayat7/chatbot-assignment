import { Hono } from 'hono';
import { corsMiddleware } from './middleware/cors';
import authRoutes from './features/auth';
import projectRoutes from './features/projects';
import conversationRoutes from './features/conversations';
import chatRoutes from './features/chat';

const app = new Hono();

app.use('/*', corsMiddleware);

app.get('/', (c) => c.json({ status: 'ok' }));

app.route('/auth', authRoutes);
app.route('/projects', projectRoutes);
app.route('/conversations', conversationRoutes);
app.route('/chat', chatRoutes);

export default app;
