import { inngest } from "./client";
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { prisma } from "@/lib/prisma";

export const generateCareerReport = inngest.createFunction(
  { id: "generate-career-report", retries: 5 }, // 5 retries com backoff exponencial
  { event: "assessment/completed" },
  async ({ event, step }) => {
    const { assessmentId, name, currentRole, topMatches } = event.data;

    // 1. Marcar como processando no banco
    await step.run("update-status-processing", async () => {
      await prisma.assessment.update({
        where: { id: assessmentId },
        data: { status: 'PROCESSING' }
      });
    });

    // 2. Chamar a IA com retry automático se falhar (ex: Rate Limit do Free Tier)
    const reportText = await step.run("generate-ai-report", async () => {
      const prompt = `
        Act as a Senior US Tech Career Strategist specializing in career pivots for beginners. 
        Generate a professional "Career Integration Report" for ${name}, transitioning from "${currentRole}".
        Target Roles (Top Matches): ${topMatches.join(', ')}.

        STRUCTURE:
        1. Executive Summary: High-level analysis of their "Professional DNA" and why these specific matches make sense based on their background.
        2. The Match Matrix: For each of the Top 3 roles, provide:
           - Match Score (%) and Stars (⭐)
           - "Why You?": A 1-sentence strategic link between their current background and this role.
           - Pivot Difficulty: (Easy/Medium/Hard) and a brief reason why.
           - AI Resilience: A score (1-10) on how resistant this role is to automation.
        3. Technical Skills Gap: A detailed analysis of "What you have" vs "What the US Market demands" for the #1 match. Include 4 specific skills with star ratings (⭐).
        4. The 48-Hour Quick Start: 3 concrete, low-barrier actions they can take in the next 48 hours to initiate this career pivot.
        5. Strategic 6-Month Roadmap: A phase-by-phase evolution plan (Phase 1: Foundation, Phase 2: Specialization, Phase 3: Integration).
        6. Recommended Strategic Project: A high-level technical specification for a "Market-Ready" project that would impress US recruiters.
        7. Resources & Certifications: Top 3 certifications and 2 high-quality free resources with URLs.
        8. Final Strategic Advice: Authority-driven advice on how to position themselves as a "Strategic Partner" rather than just a junior applicant.

        RULES: 
        - Use Title Case for all headings (## 1. Executive Summary, etc.).
        - Professional, data-driven, and authoritative tone.
        - Use Markdown formatting for bolding, lists, and tables.
        - Focus on US Market context (Salaries in USD, US Hubs like Austin, Seattle, etc.).
      `;

      const { text } = await generateText({
        model: google('gemini-2.5-flash-lite'), // Lite para ser mais econômico na cota
        prompt: prompt,
      });

      return text;
    });

    // 3. Salvar o relatório no banco e marcar como concluído
    await step.run("save-report", async () => {
      await prisma.$transaction([
        prisma.report.create({
          data: {
            assessmentId: assessmentId,
            content: reportText
          }
        }),
        prisma.assessment.update({
          where: { id: assessmentId },
          data: { status: 'COMPLETED' }
        })
      ]);
    });

    return { status: "success", assessmentId };
  }
);
