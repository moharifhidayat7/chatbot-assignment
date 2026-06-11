import OpenAI from 'openai';
import type { ChatMessage } from './chat.types';

export async function* streamCompletion(
  systemPrompt: string,
  messages: ChatMessage[],
  config: { apiKey: string; baseURL?: string; model?: string },
): AsyncGenerator<string> {
  const openai = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL || undefined });
  const stream = await openai.chat.completions.create({
    model: config.model ?? 'gpt-4o-mini',
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
