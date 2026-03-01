import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@/lib/ai";
import { mockReports } from "@/data/mock-data";
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

        // Get queue stats from mock data
        const getQueueStats = () => {
            const openReports = mockReports.filter(r => r.status === "open" || r.status === "in_progress");
            const criticalCount = mockReports.filter(r => r.severity === "critical").length;
            const highCount = mockReports.filter(r => r.severity === "high").length;

            // Calculate average triage time (mock)
            const avgTriageTime = 2.3; // days

            // SLO compliance (mock)
            const sloCompliance = 87.5;

            return {
                openCount: openReports.length,
                sloCompliance,
                avgTriageTime,
                criticalCount,
                highCount,
            };
        };

        // Get vulnerability class breakdown
        const getVulnClassBreakdown = () => {
            const breakdown: Record<string, number> = {};
            mockReports.forEach(report => {
                breakdown[report.type] = (breakdown[report.type] || 0) + 1;
            });
            return Object.entries(breakdown)
                .map(([vulnClass, count]) => ({ vulnClass, count }))
                .sort((a, b) => b.count - a.count);
        };

        // Get SLO trend
        const getSLOTrend = (days: number) => {
            const trend = [];
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                trend.push({
                    date: date.toISOString().split("T")[0],
                    sloPercent: 80 + Math.random() * 20,
                });
            }
            return trend;
        };

        // Get researcher leaderboard
        const getResearcherLeaderboard = () => {
            const researchers: Record<string, { reports: number; bounties: number }> = {};
            mockReports.forEach(report => {
                if (!researchers[report.researcher]) {
                    researchers[report.researcher] = { reports: 0, bounties: 0 };
                }
                researchers[report.researcher].reports += 1;
                researchers[report.researcher].bounties += report.bounty;
            });

            return Object.entries(researchers)
                .map(([handle, stats]) => ({ handle, ...stats }))
                .sort((a, b) => b.bounties - a.bounties)
                .slice(0, 5);
        };

        const queueStats = getQueueStats();
        const vulnBreakdown = getVulnClassBreakdown();
        const sloTrend = getSLOTrend(7);
        const leaderboard = getResearcherLeaderboard();

        const result = streamText({
            model: openai(getModel()),
            system: `You are a bug bounty program intelligence analyst. You have access to the program's statistics:

CURRENT QUEUE STATS:
- Open Reports: ${queueStats.openCount}
- SLO Compliance: ${queueStats.sloCompliance}%
- Average Triage Time: ${queueStats.avgTriageTime} days
- Critical Vulnerabilities: ${queueStats.criticalCount}
- High Vulnerabilities: ${queueStats.highCount}

VULNERABILITY BREAKDOWN:
${vulnBreakdown.map(v => `- ${v.vulnClass}: ${v.count}`).join("\n")}

7-DAY SLO TREND:
${sloTrend.map(d => `- ${d.date}: ${d.sloPercent.toFixed(1)}%`).join("\n")}

TOP RESEARCHERS (by bounties):
${leaderboard.map(r => `- ${r.handle}: $${r.bounties.toLocaleString()} (${r.reports} reports)`).join("\n")}

Answer questions about the bug bounty program's performance using this data. Be helpful, concise, and provide actionable insights. ${SYSTEM_PROMPT_SEPARATOR}`,
            messages,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("Intel Agent Error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to process intelligence request" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
