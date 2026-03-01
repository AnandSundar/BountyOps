import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@/lib/ai";
import { z } from "zod";

const matchSchema = z.object({
    reportId: z.string(),
    similarityReason: z.string(),
    similarity: z.number().min(0).max(1),
});

const duplicateCheckSchema = z.object({
    isDuplicate: z.boolean(),
    confidence: z.enum(["high", "medium", "low"]),
    matches: z.array(matchSchema),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { newReport, existingReports } = body;

        if (!newReport || !existingReports || !Array.isArray(existingReports)) {
            return NextResponse.json(
                { error: "newReport and existingReports array are required" },
                { status: 400 }
            );
        }

        const existingReportsText = existingReports
            .map(
                (report: any, index: number) =>
                    `Report ${index + 1} (ID: ${report.id}):
  Title: ${report.title}
  Type: ${report.type}
  Description: ${report.description}
  Severity: ${report.severity}`
            )
            .join("\n\n");

        const result = await generateObject({
            model: openai("gpt-4o"),
            schema: duplicateCheckSchema,
            system: `You are a duplicate detection specialist for a bug bounty program. Analyze incoming reports against the existing report database to identify potential duplicates. Be thorough in comparing vulnerability types, affected endpoints, and attack vectors.`,
            prompt: `Analyze the following new report for duplicates against the existing reports database:

**New Report:**
Title: ${newReport.title}
Description: ${newReport.description}
Type: ${newReport.type}
Affected Endpoint: ${newReport.affectedEndpoint || "Not specified"}
Impact: ${newReport.impact || "Not specified"}

**Existing Reports Database:**
${existingReportsText}

Compare the new report against each existing report and determine if it's a duplicate. Consider:
1. Same vulnerability type affecting similar endpoints
2. Similar attack vectors or impact
3. Overlapping affected URLs/parameters

For each potential match, provide:
- The report ID of the match
- A similarity reason (specific details about why they might be related)
- A similarity score (0-1, where 1 is identical)

Finally, determine if this report should be marked as a duplicate based on the confidence level.`,
        });

        return NextResponse.json({
            success: true,
            data: result.object,
        });
    } catch (error) {
        console.error("Duplicate Check Agent Error:", error);
        return NextResponse.json(
            { error: "Failed to process duplicate check" },
            { status: 500 }
        );
    }
}
