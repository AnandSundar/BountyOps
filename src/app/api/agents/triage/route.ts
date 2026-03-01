import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@/lib/ai";
import { z } from "zod";
import { sanitizeAgentInput, SYSTEM_PROMPT_SEPARATOR } from "@/lib/agents/sanitize";
import { getModel } from "@/lib/agents/modelConfig";

const triageSchema = z.object({
    severity: z.enum(["critical", "high", "medium", "low", "informational"]),
    vulnClass: z.string(),
    confidenceScore: z.number().min(0).max(100),
    summary: z.string(),
    recommendedNextStep: z.string(),
    requiresEscalation: z.boolean(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, stepsToReproduce, affectedUrl, reporterHandle } = body;

        if (!title || !description) {
            return NextResponse.json(
                { error: "Title and description are required" },
                { status: 400 }
            );
        }

        // Sanitize all user inputs
        const sanitizedTitle = sanitizeAgentInput(title);
        const sanitizedDesc = sanitizeAgentInput(description);
        const sanitizedSteps = sanitizeAgentInput(stepsToReproduce || '');
        const sanitizedUrl = sanitizeAgentInput(affectedUrl || '');
        const sanitizedReporter = sanitizeAgentInput(reporterHandle || '');

        const result = await generateObject({
            model: openai(getModel()),
            schema: triageSchema,
            system: `You are a senior security analyst triaging bug bounty reports for a large e-commerce platform. Be concise, precise, and prioritize merchant data protection and multi-tenant risk. Analyze the vulnerability report and provide a structured assessment. ${SYSTEM_PROMPT_SEPARATOR}`,
            prompt: `Analyze the following bug bounty report and provide a structured triage assessment:

**Title:** ${sanitizedTitle.sanitized}
**Description:** ${sanitizedDesc.sanitized}
**Steps to Reproduce:** ${sanitizedSteps.sanitized || "Not provided"}
**Affected URL:** ${sanitizedUrl.sanitized || "Not provided"}
**Reporter:** ${sanitizedReporter.sanitized || "Anonymous"}

Provide your assessment with:
- severity level (critical/high/medium/low/informational)
- vulnerability classification
- confidence score (0-100)
- a 1-2 sentence plain English summary
- recommended next step
- whether this requires escalation to the security team`,
        });

        return NextResponse.json({
            success: true,
            data: result.object,
            sanitizationApplied: sanitizedTitle.wasModified || sanitizedDesc.wasModified,
        });
    } catch (error) {
        console.error("Triage Agent Error:", error);
        return NextResponse.json(
            { error: "Failed to process triage request" },
            { status: 500 }
        );
    }
}
