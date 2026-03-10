import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generateCareerReport } from "@/lib/inngest/functions";

// Define que esta rota pode rodar por até 60 segundos na Vercel (Free Tier)
export const maxDuration = 60;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateCareerReport,
  ],
});
