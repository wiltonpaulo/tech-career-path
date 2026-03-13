import { serve } from "inngest/next";
import { NextRequest } from "next/server";
import { inngest } from "@/lib/inngest/client";
import { generateCareerReport } from "@/lib/inngest/functions";

// Define que esta rota pode rodar por até 60 segundos na Vercel (Free Tier)
export const maxDuration = 60;
// Força a rota ser dinâmica para garantir que query params (?fnId=...) não sejam perdidos
// Isso resolve o erro "No function ID found in request"
export const dynamic = "force-dynamic";

const inngestHandler = serve({
  client: inngest,
  functions: [
    generateCareerReport,
  ],
});

const handler = async (req: NextRequest, context: any) => {
  console.log(`[Inngest Endpoint] Method: ${req.method} | URL: ${req.url}`);
  console.log(`[Inngest Endpoint] Search Params: ${JSON.stringify(Object.fromEntries(req.nextUrl.searchParams))}`);
  return inngestHandler(req, context);
};

export { handler as GET, handler as POST, handler as PUT };
