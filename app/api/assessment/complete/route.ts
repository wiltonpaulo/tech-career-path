import { prisma } from "@/lib/prisma";
import { inngest } from "@/lib/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, currentRole, answers, topMatches } = body;

    console.log("DEBUG: Assessment Completion API Called", { email, name });

    if (!email) {
      console.error("DEBUG: Missing email in body", body);
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // 1. Criar ou encontrar o usuário (baseado no email)
    console.log("DEBUG: Upserting user in Prisma...");
    const user = await prisma.user.upsert({
      where: { email: email },
      update: { name: name },
      create: {
        email: email,
        name: name,
      },
    });
    console.log("DEBUG: User upserted:", user.id);

    // 2. Salvar o Assessment no banco
    console.log("DEBUG: Creating assessment in Prisma...");
    const assessment = await prisma.assessment.create({
      data: {
        userId: user.id,
        answers: JSON.parse(JSON.stringify(answers)), // Garante que seja JSON
        topMatches: topMatches,
        currentRole: currentRole,
        status: 'PENDING',
      },
    });
    console.log("DEBUG: Assessment created:", assessment.id);

    // 3. Disparar a fila do Inngest em background
    console.log("DEBUG: Sending event to Inngest...");
    await inngest.send({
      name: "assessment/completed",
      data: {
        assessmentId: assessment.id,
        name: name,
        currentRole: currentRole,
        topMatches: topMatches,
      },
    });
    console.log("DEBUG: Inngest event sent!");

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
