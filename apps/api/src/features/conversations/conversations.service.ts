import { eq, and, asc } from 'drizzle-orm';
import type { AppDb } from '../../lib/types';
import { conversations, messages } from '../../../drizzle/schema';
import type { Conversation, Message } from './conversations.types';

export async function findByProject(projectId: string, userId: string, db: AppDb): Promise<Conversation[]> {
  return db
    .select()
    .from(conversations)
    .where(and(eq(conversations.projectId, projectId), eq(conversations.userId, userId)))
    .orderBy(asc(conversations.updatedAt));
}

export async function findById(id: string, userId: string, db: AppDb): Promise<Conversation | undefined> {
  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id))
    .limit(1);
  return conv?.userId === userId ? conv : undefined;
}

export async function create(projectId: string, userId: string, db: AppDb): Promise<Conversation> {
  const [conv] = await db
    .insert(conversations)
    .values({ projectId, userId })
    .returning();
  return conv;
}

export async function updateTitle(id: string, title: string, db: AppDb): Promise<void> {
  await db
    .update(conversations)
    .set({ title, updatedAt: new Date().toISOString() })
    .where(eq(conversations.id, id));
}

export async function getMessages(conversationId: string, db: AppDb): Promise<Message[]> {
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));
}

export async function remove(id: string, userId: string, db: AppDb): Promise<boolean> {
  const result = await db
    .delete(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.userId, userId)))
    .returning({ id: conversations.id });
  return result.length > 0;
}

export async function appendMessage(
  conversationId: string,
  role: Message['role'],
  content: string,
  db: AppDb,
): Promise<Message> {
  const [msg] = await db
    .insert(messages)
    .values({ conversationId, role, content })
    .returning();
  return msg;
}
