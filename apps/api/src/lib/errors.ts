import type { Context } from 'hono';

export function notFound(c: Context, message = 'Not found') {
  return c.json({ message }, 404);
}

export function unauthorized(c: Context, message = 'Unauthorized') {
  return c.json({ message }, 401);
}

export function badRequest(c: Context, message: string) {
  return c.json({ message }, 400);
}

export function conflict(c: Context, message: string) {
  return c.json({ message }, 409);
}

export function serverError(c: Context, message = 'Internal server error') {
  return c.json({ message }, 500);
}
