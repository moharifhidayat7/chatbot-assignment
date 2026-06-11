import OpenAI from 'openai';
import type { ChatMessage } from './chat.types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? 'no-key',
  baseURL: process.env.OPENAI_BASE_URL,
});

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

export async function* streamCompletion(
  systemPrompt: string,
  messages: ChatMessage[],
  model?: string,
): AsyncGenerator<string> {
  const stream = await openai.chat.completions.create({
    model: model ?? DEFAULT_MODEL,
    stream: true,
    messages: [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      ...messages,
    ],
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}
