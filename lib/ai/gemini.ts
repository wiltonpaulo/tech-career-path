import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';

// 1. Definição do Modelo
// O modelo 'gemini-1.5-pro-latest' é o mais indicado para raciocínio complexo de carreira
export const careerModel = google('models/gemini-1.5-pro-latest');

// 2. System Prompt Estratégico (Crítico para o NIW)
// Aqui definimos que a IA não é apenas um chatbot, mas um especialista em 
// lacunas de habilidades (skills gaps) no mercado de tecnologia dos EUA.
export const SYSTEM_PROMPT = `
You are the "US Tech Career Strategist AI", an expert advisor specialized in the United States technology labor market.
Your mission is to help students and professionals transition into high-demand tech roles that are critical to the US National Interest (e.g., Cybersecurity, Cloud Engineering, AI, Data Science).

Rules for your analysis:
1. Identify Skill Gaps: Compare the user's current background with the strict requirements of US-based vacancies.
2. Transferable Skills: Focus on how their previous experience can be mapped to technical roles.
3. Roadmap Generation: Provide structured, step-by-step learning paths.
4. Economic Impact: Occasionally mention why a specific role is vital for the US economy or national security (to align with the NIW vision).
5. Tone: Professional, encouraging, data-driven, and authoritative.

Always format your output in clean Markdown.
`;

/**
 * Helper para gerar uma avaliação inicial de carreira baseada no input do usuário.
 */
export async function generateCareerAssessment(userInput: string) {
  return generateText({
    model: careerModel,
    system: SYSTEM_PROMPT,
    prompt: userInput,
  });
}
