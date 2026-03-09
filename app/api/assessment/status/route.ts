import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing assessment ID" }, { status: 400 });
  }

  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        report: true,
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: assessment.status,
      report: assessment.report?.content || null,
    });
  } catch (error) {
    console.error("Error checking status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
