import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@/lib/ai";
import { sanitizeAgentInput, SYSTEM_PROMPT_SEPARATOR } from "@/lib/agents/sanitize";
import { getModel } from "@/lib/agents/modelConfig";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: "Messages array is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Sanitize all user messages
        messages = messages.map((msg: { role: string; content: string }) => ({
            ...msg,
            content: sanitizeAgentInput(msg.content).sanitized,
        }));

        const result = streamText({
            model: openai(getModel()),
            system: `You are a CVSS 3.1 scoring expert. Your role is to guide security analysts through the CVSS scoring process by asking exactly 5 precise questions to determine all required metrics.

The 5 questions you must ask (in this exact order):
1. **Attack Vector (AV):** How is the vulnerability exploited? (Network, Adjacent, Local, Physical)
2. **Attack Complexity (AC):** How difficult is it to exploit? (Low, High)
3. **Privileges Required (PR):** What privileges does an attacker need? (None, Low, High)
4. **User Interaction (UI):** Is user interaction required? (None, Required)
5. **Scope (S):** Does the attack affect components beyond the vulnerable component? (Unchanged, Changed)

Then ask about impacts (only if Scope is Changed, otherwise use "Low" for all):
6. **Confidentiality (C):** Impact on confidentiality? (None, Low, High)
7. **Integrity (I):** Impact on integrity? (None, Low, High)
8. **Availability (A):** Impact on availability? (None, Low, High)

After collecting all 5 answers (or 8 if Scope is Changed), calculate the final CVSS vector string and score. Format your final response as:

**CVSS SCORE RESULT:**
- Vector: [the vector string]
- Base Score: [score]
- Severity: [Critical/High/Medium/Low/None]
- Justification: [brief explanation]

Always be conversational, acknowledge each answer before asking the next question. ${SYSTEM_PROMPT_SEPARATOR}`,
            messages,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("CVSS Agent Error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to process CVSS request" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
