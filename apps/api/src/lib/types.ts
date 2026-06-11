import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type * as schema from '../../drizzle/schema';

export type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  OPENAI_API_KEY: string;
  OPENAI_BASE_URL?: string;
  OPENAI_MODEL?: string;
  FRONTEND_URL?: string;
};

export type AppDb = NeonHttpDatabase<typeof schema>;

export type AppEnv = {
  Bindings: Bindings;
  Variables: {
    userId: string;
    db: AppDb;
  };
};
