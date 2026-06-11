import { Link } from 'react-router-dom';
import { Bot, MessageSquare, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Bot className="size-5 text-primary" />
          <span>AI Chatbot</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-12 p-8 text-center">
        <div className="flex flex-col items-center gap-6 max-w-xl">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
            <Bot className="size-10" />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold tracking-tight">
              Build AI agents,<br />have real conversations.
            </h1>
            <p className="text-lg text-muted-foreground">
              Create custom AI assistants with your own system prompts, then chat with them in real time.
            </p>
          </div>
          <div className="flex gap-3">
            <Button size="lg" asChild>
              <Link to="/register">Create your first agent</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-2xl w-full">
          {[
            {
              icon: Bot,
              title: 'Custom agents',
              desc: 'Define your agent\'s personality and knowledge with a system prompt.',
            },
            {
              icon: MessageSquare,
              title: 'Multi-turn chat',
              desc: 'Conversations are context-aware — your agent remembers the whole thread.',
            },
            {
              icon: Zap,
              title: 'Streamed responses',
              desc: 'Responses stream in real time, just like ChatGPT.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col gap-2 rounded-xl border p-5 text-left">
              <Icon className="size-5 text-primary" />
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
