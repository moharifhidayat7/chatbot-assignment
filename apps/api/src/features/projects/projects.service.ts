import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../lib/db';
import { projects } from '../../../drizzle/schema';
import type { Project, CreateProjectDto, UpdateProjectDto } from './projects.types';

export async function findAllByUser(userId: string): Promise<Project[]> {
  return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt));
}

export async function findById(id: string, userId: string): Promise<Project | undefined> {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .limit(1);
  return project;
}

export async function create(userId: string, dto: CreateProjectDto): Promise<Project> {
  const [project] = await db
    .insert(projects)
    .values({ userId, name: dto.name, systemPrompt: dto.systemPrompt, scopeEnforced: dto.scopeEnforced ?? false })
    .returning();
  return project;
}

export async function update(id: string, userId: string, dto: UpdateProjectDto): Promise<Project | undefined> {
  const [updated] = await db
    .update(projects)
    .set({
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.systemPrompt !== undefined && { systemPrompt: dto.systemPrompt }),
      ...(dto.scopeEnforced !== undefined && { scopeEnforced: dto.scopeEnforced }),
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .returning();
  return updated;
}

export async function remove(id: string, userId: string): Promise<boolean> {
  const result = await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .returning({ id: projects.id });
  return result.length > 0;
}
