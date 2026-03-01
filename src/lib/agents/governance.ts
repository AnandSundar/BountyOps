// ASI10: Rogue Agents - Governance Layer
import { logSecurityEvent, logInfo } from '../logger';

export interface AgentAuditEntry {
    agentName: string;
    sessionId: string;
    timestamp: number;
    inputTokenCount: number;
    outputTokenCount: number;
    toolsInvoked: string[];
    scopeViolationAttempted: boolean;
    outputBlocked: boolean;
    durationMs: number;
}

const AGENT_AUDIT_LOG: AgentAuditEntry[] = [];

export function wrapAgentCall<T>(
    agentName: string,
    fn: () => Promise<T>,
    options: {
        sessionId: string;
        timeoutMs?: number;
    }
): Promise<T> {
    const startTime = Date.now();
    const timeout = options.timeoutMs || 30000;

    return Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Agent timeout')), timeout)
        )
    ]).then(result => {
        const entry: AgentAuditEntry = {
            agentName,
            sessionId: options.sessionId,
            timestamp: Date.now(),
            inputTokenCount: 0,
            outputTokenCount: 0,
            toolsInvoked: [],
            scopeViolationAttempted: false,
            outputBlocked: false,
            durationMs: Date.now() - startTime,
        };
        AGENT_AUDIT_LOG.push(entry);
        logInfo('AGENT_COMPLETED', { ...entry });
        return result;
    }).catch(error => {
        const entry: AgentAuditEntry = {
            agentName,
            sessionId: options.sessionId,
            timestamp: Date.now(),
            inputTokenCount: 0,
            outputTokenCount: 0,
            toolsInvoked: [],
            scopeViolationAttempted: false,
            outputBlocked: true,
            durationMs: Date.now() - startTime,
        };
        AGENT_AUDIT_LOG.push(entry);
        throw error;
    });
}

export function getAuditLog(): AgentAuditEntry[] {
    return AGENT_AUDIT_LOG.slice(-100);
}
