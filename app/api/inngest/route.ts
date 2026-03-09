import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generateCareerReport } from "@/lib/inngest/functions";

// Servindo as funções do Inngest via API do Next.js
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateCareerReport,
  ],
});
