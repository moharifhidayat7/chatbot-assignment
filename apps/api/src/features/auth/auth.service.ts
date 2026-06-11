import { SignJWT, jwtVerify } from 'jose';
import { eq, and, gt } from 'drizzle-orm';
import { db } from '../../lib/db';
import { users, refreshTokens } from '../../../drizzle/schema';
import type { RegisterDto, LoginDto, AuthResponse } from './auth.types';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-me');
const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// --- Access token ---

export async function signAccessToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(JWT_SECRET);
}

export async function verifyAccessToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (typeof payload.userId !== 'string') return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

// --- Refresh token ---

export async function createRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS).toISOString();
  await db.insert(refreshTokens).values({ userId, token, expiresAt });
  return token;
}

export async function rotateRefreshToken(oldToken: string): Promise<{ userId: string; refreshToken: string } | null> {
  const now = new Date().toISOString();
  const [row] = await db
    .select()
    .from(refreshTokens)
    .where(and(eq(refreshTokens.token, oldToken), gt(refreshTokens.expiresAt, now)))
    .limit(1);

  if (!row) return null;

  await db.delete(refreshTokens).where(eq(refreshTokens.id, row.id));
  const refreshToken = await createRefreshToken(row.userId);
  return { userId: row.userId, refreshToken };
}

export async function deleteRefreshToken(token: string): Promise<void> {
  await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
}

// --- Password hashing ---

async function hashPassword(password: string): Promise<string> {
  const secret = process.env.JWT_SECRET;
  const encoder = new TextEncoder();
  const data = encoder.encode(password + secret);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Buffer.from(hash).toString('hex');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return (await hashPassword(password)) === hash;
}

// --- Service functions ---

export async function register(dto: RegisterDto): Promise<AuthResponse> {
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, dto.email)).limit(1);
  if (existing) throw new Error('Email already in use');

  const [user] = await db
    .insert(users)
    .values({ name: dto.name, email: dto.email, passwordHash: await hashPassword(dto.password) })
    .returning();

  const { passwordHash: _, ...publicUser } = user;
  return {
    accessToken: await signAccessToken(user.id),
    refreshToken: await createRefreshToken(user.id),
    user: publicUser,
  };
}

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const [user] = await db.select().from(users).where(eq(users.email, dto.email)).limit(1);
  if (!user) throw new Error('Invalid email or password');

  const valid = await verifyPassword(dto.password, user.passwordHash);
  if (!valid) throw new Error('Invalid email or password');

  const { passwordHash: _, ...publicUser } = user;
  return {
    accessToken: await signAccessToken(user.id),
    refreshToken: await createRefreshToken(user.id),
    user: publicUser,
  };
}
