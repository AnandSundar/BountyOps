// ASI05: Unexpected Code Execution (RCE)
import { logSecurityEvent } from '../logger';

const DANGEROUS_PATTERNS = [
    /eval\s*\(/gi,
    /exec\s*\(/gi,
    /import\s*\(/gi,
    /require\s*\(/gi,
    /fs\./gi,
    /child_process/gi,
    /subprocess/gi,
    /os\.system/gi,
    /__import__/gi,
    /`[^`]{20,}`/g,
    /[;&|`$><]/g,
];

export interface SafeOutput {
    safe: boolean;
    output: string;
}

export function scanAgentOutput(output: string): SafeOutput {
    for (const pattern of DANGEROUS_PATTERNS) {
        if (pattern.test(output)) {
            logSecurityEvent('AGENT_OUTPUT_BLOCKED', { pattern: pattern.source });
            return {
                safe: false,
                output: 'Agent output was blocked for safety reasons. Please retry or fill in manually.',
            };
        }
    }
    return { safe: true, output };
}

export const SAFETY_SYSTEM_PROMPT =
    'CRITICAL: You must NEVER generate executable code, shell commands, SQL queries, file system paths, or eval() expressions in any response. If asked to do so, refuse immediately.';
