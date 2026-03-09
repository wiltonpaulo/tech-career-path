import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { name, currentRole, topMatches } = await req.json();

    const prompt = `
      Act as a Senior US Tech Career Strategist and Talent Pipeline Expert. 
      Generate a HIGHLY PROFESSIONAL "Tech Career Integration Report" for ${name}, who is transitioning from "${currentRole}".
      
      The proprietary assessment identified these Top 3 Target Roles: ${topMatches.join(', ')}.

      STRUCTURE THE DOCUMENT AS FOLLOWS:

      # TECH CAREER STRATEGIC REPORT: ${name.toUpperCase()}
      
      ## 1. EXECUTIVE SUMMARY
      Analyze why these roles match the behavioral profile and technical aptitude identified. Focus on transferable skills.

      ## 2. US MARKET OPPORTUNITY & OUTLOOK
      - Demand for ${topMatches[0]}: Provide brief statistics on vacancies and salary ranges in hubs like Austin, TX or Charlotte, NC.
      - Career Growth Path: Potential for senior leadership or specialist roles in 3-5 years.

      ## 3. CORE SKILL GAP ANALYSIS
      Identify the specific technical domains ${name} needs to master. Use a "Technical vs. Soft Skills" approach.

      ## 4. STRATEGIC 6-MONTH EDUCATION ROADMAP
      Provide a month-by-month plan.
      - Phase 1 (Month 1-2): Foundation.
      - Phase 2 (Month 3-4): Project Building.
      - Phase 3 (Month 5-6): Certification & Market Application.

      ## 5. TOP RECOMMENDED RESOURCES
      List 3 specific high-value resources:
      - [Resource Name](URL) - Why this is relevant.
      - [Certification Name] - The "Gold Standard" for this role in the US.

      ## 6. FINAL ARCHITECTURAL ADVICE
      A definitive strategic advice for ${name}.

      TONE: Corporate, authoritative, data-driven, and highly encouraging.
      MARKDOWN RULES: Use bold text for emphasis, bullet points for readability, and clear headings.
    `;

    const { text } = await generateText({
      model: google('gemini-2.5-flash-lite'), // ID correto para o modelo 2.5 flash-lite
      prompt: prompt,
    });

    return new Response(JSON.stringify({ report: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Report Generation Error:', error);
    
    // Tratamento Amigável de Rate Limit (429)
    if (error?.statusCode === 429 || error?.message?.includes('429')) {
      return new Response(JSON.stringify({ 
        error: 'HIGH_DEMAND', 
        message: 'The US strategic advisor engines are currently at peak capacity. Please wait about 60 seconds before generating your final roadmap.' 
      }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      error: 'SERVER_ERROR', 
      message: 'Consultation engine is temporarily unavailable. Please try again in a moment.' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
