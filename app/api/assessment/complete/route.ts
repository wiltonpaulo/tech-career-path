import { prisma } from "@/lib/prisma";
import { inngest } from "@/lib/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, currentRole, answers, topMatches } = body;
    
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

    // 2. Salvar o Assessment no banco
    const assessment = await prisma.assessment.create({
      data: {
        userId: user.id,
        answers: JSON.parse(JSON.stringify(answers)), // Garante que seja JSON
        topMatches: topMatches,
        currentRole: currentRole,
        status: 'PENDING',
      },
    });

    // 3. Disparar a fila do Inngest em background
    console.log(`[API] Sending Inngest event 'assessment/completed' for Assessment ID: ${assessment.id}`);
    await inngest.send({
      name: "assessment/completed",
      data: {
        assessmentId: assessment.id,
        name: name,
        currentRole: currentRole,
        topMatches: topMatches,
      },
    });
    console.log(`[API] Inngest event sent successfully.`);

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
