import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@/lib/ai";
import { sanitizeAgentInput, SYSTEM_PROMPT_SEPARATOR } from "@/lib/agents/sanitize";
import { getModel } from "@/lib/agents/modelConfig";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { reportTitle, vulnClass, severity, disposition, researcherHandle, additionalContext } = body;

        if (!reportTitle || !vulnClass || !severity || !disposition || !researcherHandle) {
            return new Response(
                JSON.stringify({ error: "reportTitle, vulnClass, severity, disposition, and researcherHandle are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Sanitize all user inputs
        const sanitizedTitle = sanitizeAgentInput(reportTitle);
        const sanitizedVuln = sanitizeAgentInput(vulnClass);
        const sanitizedResearcher = sanitizeAgentInput(researcherHandle);
        const sanitizedContext = sanitizeAgentInput(additionalContext || '');

        const dispositionMessages: Record<string, string> = {
            valid_bounty: "This is a valid security finding that qualifies for a bounty. We're working on a fix and will award you accordingly.",
            duplicate: "We've determined this report is a duplicate of an existing report we already received.",
            out_of_scope: "This finding falls outside the scope of our bug bounty program.",
            needs_more_info: "We need additional information to properly evaluate this report.",
            fixed: "This issue has already been addressed in our latest release.",
        };

        const result = streamText({
            model: openai(getModel()),
            system: `You are a security analyst at Shopify writing responses to external security researchers. Your tone is: warm, specific, professional, and direct.

Always:
- Thank them by handle
- Reference the specific finding
- Explain the disposition clearly
- For valid reports, express genuine appreciation
- Keep it under 150 words ${SYSTEM_PROMPT_SEPARATOR}`,
            prompt: `Write a response to security researcher "${sanitizedResearcher.sanitized}" about their bug report.

**Report Details:**
- Title: ${sanitizedTitle.sanitized}
- Vulnerability Type: ${sanitizedVuln.sanitized}
- Severity: ${severity}
- Disposition: ${disposition} - ${dispositionMessages[disposition] || ""}
${sanitizedContext.sanitized ? `- Additional Context: ${sanitizedContext.sanitized}` : ""}

Write a professional, warm response that:
1. Thanks them by name
2. References their specific finding
3. Explains the disposition clearly
4. For valid bounty reports, expresses genuine appreciation for their work
5. Keeps it concise (max 150 words)`,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("Draft Response Agent Error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate response" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
