import { prisma } from "@/lib/prisma";
import { inngest } from "@/lib/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { assessmentId } = await req.json();

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { user: true },
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    // Disparar o Inngest manualmente
    await inngest.send({
      name: "assessment/completed",
      data: {
        assessmentId: assessment.id,
        name: assessment.user.name,
        currentRole: assessment.currentRole,
        topMatches: assessment.topMatches,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Retry Error:", error);
    return NextResponse.json({ error: "Failed to retry generation" }, { status: 500 });
  }
}
