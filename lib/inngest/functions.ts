import { inngest } from "./client";
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { prisma } from "@/lib/prisma";

export const generateCareerReport = inngest.createFunction(
  { id: "generate-career-report", retries: 5 },
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

    // 2. Chamar a IA
    const reportText = await step.run("generate-ai-report", async () => {
      const prompt = `
        Act as a Senior US Tech Career Strategist specializing in career pivots for beginners. 
        Generate a professional "Career Integration Report" for ${name}, transitioning from "${currentRole}".
        Target Roles (Top Matches): ${topMatches.join(', ')}.

        (Restante do seu prompt...)
      `;

      const { text } = await generateText({
        model: google('gemini-2.5-flash-lite'),
        prompt: prompt,
      });

      return text;
    });

    // 3. Salvar o relatório (usando upsert para permitir re-runs) e marcar como concluído
    await step.run("save-report-final", async () => {
      // Usamos uma transação para garantir que ambos os passos ocorram
      await prisma.$transaction([
        prisma.report.upsert({
          where: { assessmentId: assessmentId },
          update: { content: reportText },
          create: {
            assessmentId: assessmentId,
            content: reportText
          }
        }),
        prisma.assessment.update({
          where: { id: assessmentId },
          data: { status: 'COMPLETED' }
        })
      ]);
      console.log(`>>> [SUCCESS] Report saved for assessment: ${assessmentId}`);
    });

    return { status: "success", assessmentId };
  }
);
