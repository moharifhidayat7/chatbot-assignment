import { SignJWT, jwtVerify } from 'jose';
import { eq, and, gt } from 'drizzle-orm';
import type { AppDb } from '../../lib/types';
import { users, refreshTokens } from '../../../drizzle/schema';
import type { RegisterDto, LoginDto, AuthResponse } from './auth.types';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function jwtKey(secret: string) {
  return new TextEncoder().encode(secret);
}

// --- Access token ---

export async function signAccessToken(userId: string, jwtSecret: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(jwtKey(jwtSecret));
}

export async function verifyAccessToken(
  token: string,
  jwtSecret: string,
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, jwtKey(jwtSecret));
    if (typeof payload.userId !== 'string') return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

// --- Refresh token ---

export async function createRefreshToken(userId: string, db: AppDb): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS).toISOString();
  await db.insert(refreshTokens).values({ userId, token, expiresAt });
  return token;
}

export async function rotateRefreshToken(
  oldToken: string,
  db: AppDb,
): Promise<{ userId: string; refreshToken: string } | null> {
  const now = new Date().toISOString();
  const [row] = await db
    .select()
    .from(refreshTokens)
    .where(and(eq(refreshTokens.token, oldToken), gt(refreshTokens.expiresAt, now)))
    .limit(1);

  if (!row) return null;

  await db.delete(refreshTokens).where(eq(refreshTokens.id, row.id));
  const refreshToken = await createRefreshToken(row.userId, db);
  return { userId: row.userId, refreshToken };
}

export async function deleteRefreshToken(token: string, db: AppDb): Promise<void> {
  await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
}

// --- Password hashing ---

async function hashPassword(password: string, jwtSecret: string): Promise<string> {
  const data = new TextEncoder().encode(password + jwtSecret);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string, jwtSecret: string): Promise<boolean> {
  return (await hashPassword(password, jwtSecret)) === hash;
}

// --- Service functions ---

export async function register(dto: RegisterDto, db: AppDb, jwtSecret: string): Promise<AuthResponse> {
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, dto.email)).limit(1);
  if (existing) throw new Error('Email already in use');

  const [user] = await db
    .insert(users)
    .values({ name: dto.name, email: dto.email, passwordHash: await hashPassword(dto.password, jwtSecret) })
    .returning();

  const { passwordHash: _, ...publicUser } = user;
  return {
    accessToken: await signAccessToken(user.id, jwtSecret),
    refreshToken: await createRefreshToken(user.id, db),
    user: publicUser,
  };
}

export async function login(dto: LoginDto, db: AppDb, jwtSecret: string): Promise<AuthResponse> {
  const [user] = await db.select().from(users).where(eq(users.email, dto.email)).limit(1);
  if (!user) throw new Error('Invalid email or password');

  const valid = await verifyPassword(dto.password, user.passwordHash, jwtSecret);
  if (!valid) throw new Error('Invalid email or password');

  const { passwordHash: _, ...publicUser } = user;
  return {
    accessToken: await signAccessToken(user.id, jwtSecret),
    refreshToken: await createRefreshToken(user.id, db),
    user: publicUser,
  };
}
