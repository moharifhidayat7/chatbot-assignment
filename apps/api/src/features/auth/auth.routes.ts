import { Hono } from 'hono';
import { register, login, rotateRefreshToken, deleteRefreshToken, signAccessToken } from './auth.service';
import { badRequest, conflict } from '../../lib/errors';

const auth = new Hono();

auth.post('/register', async (c) => {
  const body = await c.req.json<{ name?: string; email?: string; password?: string }>();

  if (!body.name || !body.email || !body.password) {
    return badRequest(c, 'name, email and password are required');
  }
  if (body.password.length < 8) {
    return badRequest(c, 'Password must be at least 8 characters');
  }

  try {
    const result = await register({ name: body.name, email: body.email, password: body.password });
    return c.json(result, 201);
  } catch (err) {
    return conflict(c, err instanceof Error ? err.message : 'Registration failed');
  }
});

auth.post('/login', async (c) => {
  const body = await c.req.json<{ email?: string; password?: string }>();

  if (!body.email || !body.password) {
    return badRequest(c, 'email and password are required');
  }

  try {
    const result = await login({ email: body.email, password: body.password });
    return c.json(result);
  } catch (err) {
    return c.json({ message: err instanceof Error ? err.message : 'Login failed' }, 401);
  }
});

auth.post('/refresh', async (c) => {
  const body = await c.req.json<{ refreshToken?: string }>();
  if (!body.refreshToken) return badRequest(c, 'refreshToken is required');

  const result = await rotateRefreshToken(body.refreshToken);
  if (!result) return c.json({ message: 'Invalid or expired refresh token' }, 401);

  const accessToken = await signAccessToken(result.userId);
  return c.json({ accessToken, refreshToken: result.refreshToken });
});

auth.post('/logout', async (c) => {
  const body = await c.req.json<{ refreshToken?: string }>();
  if (body.refreshToken) await deleteRefreshToken(body.refreshToken);
  return c.body(null, 204);
});

export default auth;
