import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

const MOCK_REPORT = `
# Tech Career Strategic Report: Wilton Paulo
      
## 1. Executive Summary
Based on our multi-dimensional behavioral analysis, your professional DNA exhibits a rare combination of **Architectural Rigor** and **Operational Excellence**. With over 20 years of experience, your transition into the US market is not merely a job change, but a strategic integration of high-level leadership into critical technical infrastructure. 

Your profile suggests a dominant lean towards systems resilience and scalable automation. In the American ecosystem, these traits are highly valued in sectors such as Federal Cloud Security and Fintech Infrastructure. We have identified a 98% alignment with Senior Solutions Architecture roles, specifically those requiring deep knowledge of self-healing systems and complex regulatory compliance (SOC2/HIPAA).

## 2. Technical Skills Analysis
- **Infrastructure as Code (Terraform/OpenTofu):** ⭐⭐⭐⭐⭐
Advanced mastery in modularizing multi-cloud environments and managing state at scale across heterogeneous providers.
- **Kubernetes & Container Orchestration:** ⭐⭐⭐⭐⭐
Deep expertise in service mesh (Istio), custom controllers, and production-grade cluster hardening for high-compliance workloads.
- **Cloud Security & DevSecOps:** ⭐⭐⭐⭐
Strong focus on shift-left security, automated vulnerability scanning, and identity access management (IAM) lifecycle.
- **CI/CD Pipeline Engineering:** ⭐⭐⭐⭐⭐
Architecting complex pipelines that integrate automated testing, canary deployments, and zero-downtime rollbacks.

## 3. US Market Opportunity
The current US technology landscape is facing a critical shortage of professionals capable of bridging the gap between legacy systems and cloud-native resilience. 

- **💰 Market Valuation:** $165,000 - $225,000 per year (Base Salary for Senior/Staff levels).
- **📍 Geographic Hubs:** 
  - **Austin, TX:** Rapidly becoming the "Silicon Hills", with massive demand for Infrastructure Engineers.
  - **Charlotte, NC:** The primary US banking hub, requiring extreme security and compliance expertise.
  - **Seattle, WA:** The global heart of Cloud computing (AWS/Azure headquarters).
- **Growth Outlook:** 35% projected increase in vacancies for Cloud-Native Architects by 2028.

## 4. Strategic 6-Month Roadmap
- **Month 1-2: Advanced Specialization**
Focus on acquiring the AWS Certified Solutions Architect - Professional. Even with your experience, this serves as a critical "Market Currency" in the US.
- **Month 3-4: Strategic Portfolio Development**
Document and publish a technical case study on "Migrating Monolithic Fintech Workloads to Multi-Region EKS". Public technical authority is a major differentiator.
- **Month 5-6: Executive Networking & Integration**
Engage with US-based tech communities (Cloud Native Computing Foundation). Target Staff-level positions that value your MBA and Technical Leadership background.

## 5. Recommended Strategic Project
- **🚀 Project: The "Zero-Trust" Global Cloud Mesh**
- **Description:** Build a highly available, multi-region infrastructure using Terraform and Kubernetes. Implement a Zero-Trust security model using Tailscale or Istio, with automated disaster recovery protocols that trigger in under 60 seconds.
- **Goal:** Prove to US employers your ability to handle "Mission Critical" infrastructure with absolute autonomy.

## 6. Resources & Certifications
- [AWS Skill Builder - Architect Path](https://explore.skillbuilder.aws/)
- [CNCF - Certified Kubernetes Administrator](https://training.linuxfoundation.org/)
- [HashiCorp - Infrastructure Automation Path](https://www.hashicorp.com/certification)

## 7. Final Strategic Advice
Your greatest asset is your history of technical leadership. In the US market, don't just apply as an "Engineer". Position yourself as a **Strategic Partner** who can build not just systems, but the teams and processes that keep those systems unbreakable. Operational Excellence is your primary narrative.
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
      Act as a Senior US Tech Career Strategist specializing in career pivots for beginners. 
      Generate a professional "Career Integration Report" for ${name}, transitioning from "${currentRole}".
      Target Roles (Top Matches): ${topMatches.join(', ')}.

      STRUCTURE:
      1. Executive Summary: High-level analysis of their "Professional DNA" and why these specific matches make sense based on their background.
      2. The Match Matrix: For each of the Top 3 roles, provide:
         - Match Score (%) and Stars (⭐)
         - "Why You?": A 1-sentence strategic link between their current background and this role.
         - Pivot Difficulty: (Easy/Medium/Hard) and a brief reason why.
         - AI Resilience: A score (1-10) on how resistant this role is to automation.
      3. Technical Skills Gap: A detailed analysis of "What you have" vs "What the US Market demands" for the #1 match. Include 4 specific skills with star ratings (⭐).
      4. The 48-Hour Quick Start: 3 concrete, low-barrier actions they can take in the next 48 hours to initiate this career pivot.
      5. Strategic 6-Month Roadmap: A phase-by-phase evolution plan (Phase 1: Foundation, Phase 2: Specialization, Phase 3: Integration).
      6. Recommended Strategic Project: A high-level technical specification for a "Market-Ready" project that would impress US recruiters.
      7. Resources & Certifications: Top 3 certifications and 2 high-quality free resources with URLs.
      8. Final Strategic Advice: Authority-driven advice on how to position themselves as a "Strategic Partner" rather than just a junior applicant.

      RULES: 
      - Use Title Case for all headings (## 1. Executive Summary, etc.).
      - Professional, data-driven, and authoritative tone.
      - Use Markdown formatting for bolding, lists, and tables.
      - Focus on US Market context (Salaries in USD, US Hubs like Austin, Seattle, etc.).
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
