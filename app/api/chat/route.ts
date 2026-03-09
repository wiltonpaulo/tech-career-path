import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/ai/gemini';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-pro-latest'),
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toDataStreamResponse();
}
