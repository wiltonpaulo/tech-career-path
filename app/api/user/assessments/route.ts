import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        user: {
          email: user.email
        }
      },
      include: {
        report: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error("User API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
