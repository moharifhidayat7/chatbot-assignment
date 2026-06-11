import { Hono } from 'hono';
import { streamText } from 'hono/streaming';
import type { AppEnv } from '../../lib/types';
import { authMiddleware } from '../../middleware/auth';
import { badRequest, notFound } from '../../lib/errors';
import { streamCompletion } from './chat.service';
import { findById as findProject } from '../projects/projects.service';
import {
  create as createConversation,
  findById as findConversation,
  appendMessage,
  updateTitle,
  getMessages,
} from '../conversations/conversations.service';

const chat = new Hono<AppEnv>();

chat.use('/*', authMiddleware);

// POST /chat  →  SSE stream
chat.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<{
    projectId?: string;
    conversationId?: string | null;
    messages?: Array<{ role: string; content: string }>;
    model?: string;
  }>();

  if (!body.projectId || !body.messages?.length) {
    return badRequest(c, 'projectId and messages are required');
  }

  const project = await findProject(body.projectId, userId);
  if (!project) return notFound(c);

  // Resolve or create the conversation
  let conv = body.conversationId ? await findConversation(body.conversationId, userId) : undefined;
  if (!conv) {
    conv = await createConversation(project.id, userId);
  }

  const conversationId = conv.id;

  // Persist user messages not yet in storage
  const stored = await getMessages(conversationId);
  const newMessages = body.messages.slice(stored.length);
  for (const msg of newMessages) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      await appendMessage(conversationId, msg.role, msg.content);
    }
  }

  // Set conversation title from first user message
  if (stored.length === 0 && newMessages[0]?.role === 'user') {
    await updateTitle(conversationId, newMessages[0].content.slice(0, 60));
  }

  const chatMessages = body.messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  const SCOPE_INSTRUCTION = `\n\nIMPORTANT: If the user's message is not related to your defined purpose above, you MUST politely decline. Craft a brief, natural response explaining you can only help with topics relevant to your defined purpose. Do not answer anything outside that scope.`;
  const effectiveSystemPrompt = project.scopeEnforced
    ? project.systemPrompt + SCOPE_INSTRUCTION
    : project.systemPrompt;

  let fullResponse = '';

  return streamText(c, async (stream) => {
    // Send conversationId first so the client can update URL state
    await stream.writeln(`data: ${JSON.stringify({ conversationId })}`);
    await stream.writeln('');

    for await (const delta of streamCompletion(effectiveSystemPrompt, chatMessages, body.model)) {
      fullResponse += delta;
      await stream.writeln(`data: ${JSON.stringify({ delta })}`);
      await stream.writeln('');
    }

    await appendMessage(conversationId, 'assistant', fullResponse.trim());

    await stream.writeln('data: [DONE]');
    await stream.writeln('');
  });
});

export default chat;
