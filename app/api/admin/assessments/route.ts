import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const assessments = await prisma.assessment.findMany({
      include: {
        user: true,
        report: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 });
  }
}
