# AI Chatbot Platform

A multi-tenant platform for building and deploying custom AI chat agents. Users create projects, each with its own system prompt and optional scope enforcement, then interact with the agent through a real-time streaming chat interface.

---

## Tech Stack

### API (`apps/api`)
| | |
|---|---|
| Runtime | [Bun](https://bun.sh) |
| Framework | [Hono](https://hono.dev) |
| Database ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Database | PostgreSQL |
| Auth | JWT (HS256 via `jose`) + refresh token rotation |
| AI | [OpenAI SDK](https://github.com/openai/openai-node) — streaming completions |
| Password hashing | SHA-256 with secret |

### Web (`apps/web`)
| | |
|---|---|
| Framework | React 19 + [Vite](https://vitejs.dev) |
| Routing | React Router v7 |
| State | [Zustand](https://zustand-demo.pmnd.rs) |
| UI | [shadcn/ui](https://ui.shadcn.com) (Radix Nova theme, Tailwind CSS v4) |
| Icons | [Lucide React](https://lucide.dev) |
| Markdown | [Streamdown](https://github.com/nicholasgasior/streamdown) |

---

## Project Structure

```
chatbot-assignment/
├── apps/
│   ├── api/                         # Hono REST API — port 3001
│   │   ├── drizzle/
│   │   │   ├── schema.ts            # Drizzle table definitions
│   │   │   └── *.sql                # Migration files
│   │   └── src/
│   │       ├── app.ts               # App instance, route mounting
│   │       ├── index.ts             # Bun entry point
│   │       ├── features/
│   │       │   ├── auth/            # Register, login, refresh, logout
│   │       │   ├── chat/            # SSE streaming completions
│   │       │   ├── conversations/   # CRUD + message history
│   │       │   └── projects/        # Agent config (name, system prompt, scope)
│   │       ├── lib/
│   │       │   ├── db.ts            # Drizzle + postgres client
│   │       │   ├── errors.ts        # notFound / badRequest helpers
│   │       │   └── types.ts         # Hono AppEnv (userId binding)
│   │       └── middleware/
│   │           ├── auth.ts          # JWT verification middleware
│   │           └── cors.ts          # CORS middleware
│   │
│   └── web/                         # React SPA — port 5173
│       └── src/
│           ├── App.tsx              # Router + layout shell
│           ├── layouts/             # AppLayout, AuthLayout, DashboardLayout
│           ├── pages/               # Route-level page components
│           ├── services/            # api-client.ts (fetch + silent JWT refresh)
│           ├── store/               # auth.store.ts (Zustand)
│           └── features/
│               ├── auth/            # Login / register forms + auth service
│               ├── chat/            # ChatWindow, useChat, SSE stream handling
│               ├── conversations/   # Sidebar list + conversation management
│               ├── projects/        # Dashboard cards, settings form
│               └── settings/        # Theme toggle, preferences
│
├── package.json                     # Workspace root (Bun workspaces)
└── README.md
```

---

## Database Design

![Database schema diagram](https://i.ibb.co.com/tpCdZ8Rn/db-diagram.png)

[View interactive diagram →](https://dbdiagram.io/d/6a2a300e9340ecc06571e1b1) *(link placeholder)*

Tables: `users`, `projects`, `conversations`, `messages`, `refresh_tokens`

---

## Demo

[Watch demo recording →](#) *(link placeholder)*

---

## Environment Variables

### `apps/api/.env`

```env
DATABASE_URL=

JWT_SECRET=

OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_MODEL=
```

### `apps/web/.env`

```env
VITE_API_URL=http://localhost:3001
```

## Getting Started

**Prerequisites:** Bun, PostgreSQL

```bash
# Install dependencies
bun install

# Run database migrations
cd apps/api && bun db:migrate

# Start both apps in dev mode
bun run dev
```

API runs on `http://localhost:3001`, web on `http://localhost:5173`.
