import { google } from '@ai-sdk/google';
import { streamText, createDataStreamResponse } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/ai/gemini';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('>>> [ERROR] API KEY MISSING');
      return new Response('API Key Missing', { status: 500 });
    }

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          // Modelo atualizado conforme exigência do ambiente
          model: google('gemini-2.5-flash-lite'), 
          messages,
          system: SYSTEM_PROMPT,
          onFinish: () => console.log('>>> [DEBUG] AI Stream Finished'),
        });

        result.mergeIntoDataStream(dataStream);
      },
      onError: (error) => {
        console.error('>>> [STREAM ERROR]', error);
        return 'The AI engine is currently unavailable. Please check your credentials.';
      },
    });
  } catch (error) {
    console.error('>>> [FATAL ERROR]', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
