import { prisma } from "@/lib/prisma";
import { inngest } from "@/lib/inngest/client";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, currentRole, answers, topMatches, topMatchesScores } = body;
    
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // 1. Criar ou encontrar o usuário (baseado no email)
    const user = await prisma.user.upsert({
      where: { email: email },
      update: { name: name },
      create: {
        email: email,
        name: name,
      },
    });

    // Usar uma transação serializável para evitar a condição de corrida (race condition)
    // que estava criando assessments duplicados.
    const result = await prisma.$transaction(async (tx) => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const existingAssessment = await tx.assessment.findFirst({
        where: {
          userId: user.id,
          status: { in: ['PENDING', 'PROCESSING'] },
          createdAt: { gte: fiveMinutesAgo },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (existingAssessment) {
        console.log(`[API] Requisição de assessment duplicada para o usuário ${user.id}. Retornando assessment ID existente: ${existingAssessment.id}`);
        return { assessment: existingAssessment, isNew: false };
      }

      const newAssessment = await tx.assessment.create({
        data: {
          userId: user.id,
          answers: JSON.parse(JSON.stringify(answers)), // Garante que seja JSON
          topMatches: topMatches,
          currentRole: currentRole,
          status: 'PENDING',
        },
      });

      return { assessment: newAssessment, isNew: true };
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });

    const { assessment, isNew } = result;

    // Apenas dispara o evento para o Inngest se um NOVO assessment foi criado.
    if (isNew) {
      console.log(`[API] Sending Inngest event 'assessment/completed' for Assessment ID: ${assessment.id}`);
      await inngest.send({
        name: "assessment/completed",
        data: {
          assessmentId: assessment.id,
          name: name,
          currentRole: currentRole,
          topMatches: topMatches,
          topMatchesScores: topMatchesScores || [],
        },
      });
      console.log(`[API] Inngest event sent successfully.`);
    }

    return NextResponse.json({ 
      success: true, 
      assessmentId: assessment.id 
    });
  } catch (error: any) {
    console.error("CRITICAL ERROR: Failed to complete assessment:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}
