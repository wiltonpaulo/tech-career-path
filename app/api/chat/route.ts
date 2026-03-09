import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/ai/gemini';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response('Missing GOOGLE_GENERATIVE_AI_API_KEY', { status: 500 });
    }

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: SYSTEM_PROMPT,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
