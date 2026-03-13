import { inngest } from "./client";
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { prisma } from "@/lib/prisma";
import { MARKET_ROLES } from "@/lib/assessment/roles-data";

export const generateCareerReport = inngest.createFunction(
  { id: "generate-career-report", retries: 5 },
  { event: "assessment/completed" },
  async ({ event, step }) => {
    const { assessmentId, name, currentRole, topMatches, topMatchesScores } = event.data;

    const effectiveRole = currentRole && currentRole.trim() !== "" ? currentRole : "General Professional";

    console.log(`[Inngest Function] Started processing for Assessment ID: ${assessmentId}, User: ${name}, Role: ${effectiveRole}`);

    // 1. Marcar como processando no banco
    await step.run("update-status-processing", async () => {
      console.log(`[Inngest Step] Running 'update-status-processing'`);
      await prisma.assessment.update({
        where: { id: assessmentId },
        data: { status: 'PROCESSING' }
      });
    });

    // 2. Chamar a IA
    const reportText = await step.run("generate-ai-report", async () => {
      console.log(`[Inngest Step] Generating AI Report for ${name}...`);

      // Build enriched role context from MARKET_ROLES data
      const enrichedMatches = (topMatches as string[]).map((roleName: string, i: number) => {
        const marketData = MARKET_ROLES.find(r =>
          r.title.toLowerCase().includes(roleName.toLowerCase()) ||
          roleName.toLowerCase().includes(r.title.toLowerCase().split(' ')[0].toLowerCase())
        );
        const score = topMatchesScores?.[i]?.score ?? 0;
        return {
          rank: i + 1,
          role: roleName,
          score,
          salary: marketData?.salary ?? 'N/A',
          demand: marketData?.demand ?? 'High',
          description: marketData?.description ?? '',
          skills: marketData?.skills ?? [],
          hubs: marketData?.hubs ?? [],
        };
      });

      const matchSummary = enrichedMatches
        .map(m => `#${m.rank}: ${m.role} — ${m.score} pts | Salary: ${m.salary} | Demand: ${m.demand}`)
        .join('\n');

      const prompt = `You are a Senior US Tech Career Strategist generating a "Career Integration Report".

CANDIDATE: ${name}
CURRENT BACKGROUND: ${effectiveRole}
COGNITIVE ASSESSMENT SCORES (higher = stronger behavioral alignment):
${matchSummary}

---
⚠️ CRITICAL FORMATTING RULES — FOLLOW EXACTLY OR THE REPORT WILL BE BROKEN:
1. Every section MUST begin with its heading on its OWN line.
2. Headings use EXACTLY two hash signs (##), a space, the number, a period, a space, then the title.
3. CORRECT examples:
   ## 0. Your Career Match Breakdown
   ## 1. Executive Summary
4. WRONG examples (do NOT do any of these):
   **## 0. Your Career Match Breakdown**
   ### 0. Your Career Match Breakdown
   ## 0 Your Career Match Breakdown
   0. Your Career Match Breakdown
5. Never wrap headings in bold markers (**).
6. Do not add any text before ## 0.
---

## 0. Your Career Match Breakdown

Explain the cognitive assessment scoring system in 2 sentences: what it measures and why it predicts career success.

Then for each of the 3 matched roles below, write a dedicated sub-section using this exact format:

**#[rank]. [Role Name]** — [score] Alignment Points
- **What This Role Does:** [2-sentence description of what this professional does day-to-day in the US market — use the role data provided]
- **US Market Data:** Salary ${enrichedMatches[0]?.salary ?? 'N/A'} | Demand: [demand level] | Top Hubs: [list hubs]
- **Your Profile Signal:** [2-3 sentences explaining precisely what behavioral patterns in ${name}'s cognitive assessment — the choices they made — reveal a natural alignment with this role. Be specific about the trait-to-role connection.]
- **Why This Score:** [Explain what drove the score: which answer patterns contributed most points and what that says about their natural tendencies.]

Roles to cover:
${enrichedMatches.map(m => `- #${m.rank}: ${m.role} | ${m.score} pts | Salary: ${m.salary} | Demand: ${m.demand} | Hubs: ${m.hubs.join(', ')} | Core Skills: ${m.skills.join(', ')}`).join('\n')}

## 1. Executive Summary

A 3-paragraph strategic narrative:
- Paragraph 1: Their "Professional DNA" — what their background and behavioral profile reveal about their working style and cognitive strengths.
- Paragraph 2: Why the top 3 matches (${topMatches.join(', ')}) form a coherent strategic cluster for someone coming from "${effectiveRole}".
- Paragraph 3: The single most important strategic insight that will define their success in the US tech market.

## 2. The Match Matrix

For each of the Top 3 roles, provide a structured analysis block:

**[Role Name]**
- Match Score: [X]% ⭐⭐⭐⭐⭐ (adjust stars 1-5)
- Why You?: [1-sentence strategic link between "${effectiveRole}" background and this role]
- Pivot Difficulty: [Easy / Medium / Hard] — [brief reason]
- AI Resilience: [X/10] — [1-sentence explanation]
- US Salary Range: [from MARKET_ROLES data]

## 3. Technical Skills Gap

Focus on the #1 matched role: **${topMatches[0]}**.

Two-column analysis:
- **What You Likely Have** (transferable from "${effectiveRole}"): list 4 skills with brief context
- **What The US Market Demands**: list 4 specific technical skills with ⭐ ratings (1-5 stars = beginner to expert needed)

Then add a "Gap Score" sentence estimating how many months of focused study to close the gap.

## 4. The 48-Hour Quick Start

3 concrete, zero-cost actions ${name} can take in the next 48 hours to start this career pivot. Each action must:
- Be specific and actionable (not "learn Python" — say "complete the first 2 modules of CS50P on edx.org")
- Take less than 2 hours each
- Have a visible output (a GitHub commit, a LinkedIn post, a completed module, etc.)

## 5. Strategic 6-Month Roadmap

Three phases with concrete milestones:

**Phase 1 — Foundation (Month 1-2):** [3 specific goals]
**Phase 2 — Specialization (Month 3-4):** [3 specific goals, building on Phase 1]
**Phase 3 — Market Integration (Month 5-6):** [3 specific goals focused on landing interviews]

For each phase, include one "US Market Context" note explaining why this phase matters in the current job market.

## 6. Recommended Strategic Project

Design a portfolio project that signals ${topMatches[0]} expertise to US recruiters. Provide:
- **Project Name & Tagline**
- **Problem It Solves:** [real US market pain point]
- **Tech Stack:** [specific technologies, versions if relevant]
- **Key Features:** 3-4 bullet points
- **What It Signals To Recruiters:** [why this specific project creates a strong impression]
- **GitHub README Opening Line:** [a one-liner that hooks a recruiter in 5 seconds]

## 7. Resources & Certifications

**Top 3 Certifications (ranked by ROI for US market entry):**
For each: Name | Provider | Cost | Time to Complete | Why It Matters

**Free Learning Resources:**
2 specific, high-quality free resources with their direct URLs and what to focus on within each resource.

**US Community to Join:**
1 specific Slack/Discord/meetup community relevant to ${topMatches[0]} in the US.

## 8. Final Strategic Advice

Three authority-level insights that separate candidates who land $130k+ roles from those who stay stuck:
1. [Insight about mindset / positioning]
2. [Insight about networking in the US tech market specifically]
3. [Insight about the one mistake people from "${effectiveRole}" backgrounds consistently make — and how to avoid it]

Close with a single powerful sentence that serves as ${name}'s career mantra.

---
ADDITIONAL RULES:
- Professional, data-driven, and authoritative tone throughout.
- US Market context only (salaries in USD, cities in the US).
- Use **bold** for key terms within paragraphs.
- Use proper Markdown lists and spacing.
- Do NOT add a table of contents or any preamble before ## 0.
`;

      const { text } = await generateText({
        model: google('gemini-2.5-flash-preview-05-20'),
        prompt: prompt,
      });

      console.log(`[Inngest Step] AI Response received. Length: ${text?.length || 0} characters.`);
      return text;
    });

    // 3. Salvar o relatório
    await step.run("save-report-final", async () => {
      console.log(`[Inngest Step] Attempting to save report to DB for ID: ${assessmentId}`);
      if (!reportText || reportText.length < 10) {
        console.error("[Inngest Error] Report text is too short or empty. Skipping save.");
        throw new Error("AI generated an empty report.");
      }

      await prisma.$transaction([
        prisma.report.upsert({
          where: { assessmentId: assessmentId },
          update: { content: reportText },
          create: {
            assessmentId: assessmentId,
            content: reportText
          }
        }),
        prisma.assessment.update({
          where: { id: assessmentId },
          data: { status: 'COMPLETED' }
        })
      ]);
      console.log(`[Inngest Step] Report saved successfully: ${assessmentId}`);
    });

    return { status: "success", assessmentId, processedAt: new Date().toISOString() };
  }
);
