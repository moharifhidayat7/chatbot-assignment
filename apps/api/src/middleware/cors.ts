import { cors } from 'hono/cors';

export const corsMiddleware = cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
});
