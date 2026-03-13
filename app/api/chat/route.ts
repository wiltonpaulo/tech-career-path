import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/ai/gemini';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('>>> [ERROR] API KEY MISSING');
      return new Response('API Key Missing', { status: 500 });
    }

    const result = streamText({
      model: google('gemini-2.5-flash-lite') as any,
      messages,
      system: SYSTEM_PROMPT,
      onFinish: () => console.log('>>> [DEBUG] AI Stream Finished'),
    });

    // Use toTextStreamResponse as suggested by the compiler if toDataStreamResponse is missing in this version's types
    return (result as any).toDataStreamResponse ? (result as any).toDataStreamResponse() : result.toTextStreamResponse();
  } catch (error) {
    console.error('>>> [FATAL ERROR]', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
