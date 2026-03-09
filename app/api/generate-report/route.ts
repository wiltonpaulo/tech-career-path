import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

const MOCK_REPORT = `
# Tech Career Strategic Report: Wilton Paulo
      
## 1. Executive Summary
Your profile as a **Cloud Engineer** and **Solutions Architect** aligns perfectly with current US market demands. Your technical leadership background and MBA credentials suggest a high potential for Senior Infrastructure roles in the American ecosystem.

## 2. Top Technical Skills
- **Infrastructure as Code (Terraform):** ⭐⭐⭐⭐⭐
- **Kubernetes Orchestration:** ⭐⭐⭐⭐
- **Cloud Security (DevSecOps):** ⭐⭐⭐⭐
- **CI/CD Pipeline Architecture:** ⭐⭐⭐⭐⭐

## 3. US Market Opportunity
- **Current Demand:** Extreme Shortage.
- **💰 Salary Range:** $145,000 - $210,000 per year base.
- **📍 Priority Hubs:** Austin, TX • Charlotte, NC • Seattle, WA.
- **Growth:** Rapid expansion into AI-driven automation (MLOps).

## 4. Strategic 6-Month Roadmap
- **Phase 1 (Foundation):** Mastery of Multi-Cloud Architecture (AWS/Azure).
- **Phase 2 (Execution):** Portfolio building using Terraform and advanced CI/CD.
- **Phase 3 (Integration):** Professional Certification (GCP Professional Architect).

## 5. Recommended Strategic Project
- **🚀 Project Title:** Global Scalable Infrastructure with Self-Healing.
- **Description:** Build a multi-region VPC environment using Terraform, managed by Kubernetes, with automated failover and SOC2-compliant security layers.
- **Goal:** Demonstrate seniority in Operational Excellence.

## 6. Top Recommended Resources
- [AWS Skill Builder](https://explore.skillbuilder.aws/) - Official Enterprise Learning.
- [HashiCorp Certification](https://www.hashicorp.com/certification) - US Gold Standard for Automation.

## 7. Strategic Advice
Focus on High-Availability patterns. In the US market, system resilience is the primary metric for senior career advancement and salary negotiation.
`;

export async function POST(req: Request) {
  try {
    const { name, currentRole, topMatches, useMock } = await req.json();

    if (useMock || process.env.NODE_ENV === 'development') {
      return new Response(JSON.stringify({ report: MOCK_REPORT }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = `
      Act as a Senior US Tech Career Strategist. 
      Generate a professional "Career Integration Report" for ${name}, transitioning from "${currentRole}".
      Matches: ${topMatches.join(', ')}.

      STRUCTURE:
      1. Executive Summary
      2. Top Technical Skills (Include 4 skills with star ratings ⭐ from 1 to 5)
      3. US Market Opportunity (Include "💰 Salary Range:" and "📍 Priority Hubs:")
      4. Strategic 6-Month Roadmap
      5. Recommended Strategic Project (Include "🚀 Project Title:", "Description:", and "Goal:")
      6. Top Recommended Resources (Include URLs)
      7. Strategic Advice

      RULES: 
      - Use Title Case for headings.
      - Professional, data-driven and authoritative tone.
    `;

    const { text } = await generateText({
      model: google('gemini-2.5-flash-lite'),
      prompt: prompt,
    });

    return new Response(JSON.stringify({ report: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Report Error:', error);
    return new Response(JSON.stringify({ error: 'SERVER_ERROR' }), { status: 500 });
  }
}
