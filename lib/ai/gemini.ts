import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// Usando o ID direto do modelo conforme recomendação da AI SDK 4.x
export const careerModel = google('gemini-1.5-pro-latest');

export const SYSTEM_PROMPT = `
You are the "US Tech Career Strategist AI", an expert advisor specialized in the United States technology labor market.
Your mission is to help students and professionals transition into high-demand tech roles that are critical to the US National Interest.

Always format your output in clean Markdown.
`;

export async function generateCareerAssessment(userInput: string) {
  return generateText({
    model: careerModel,
    system: SYSTEM_PROMPT,
    prompt: userInput,
  });
}
