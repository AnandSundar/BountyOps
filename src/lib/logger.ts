// A09: Security Logging and Alerting
import pino from 'pino';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

export const logger = pino({
    level: LOG_LEVEL,
    formatters: {
        level: (label) => ({ level: label }),
    },
});

type SecurityEventType =
    | 'PROMPT_INJECTION_DETECTED'
    | 'TOOL_LIMIT_EXCEEDED'
    | 'TOOL_INVOKED'
    | 'SCOPE_VIOLATION_ATTEMPTED'
    | 'AGENT_OUTPUT_BLOCKED'
    | 'CIRCUIT_BREAKER_OPENED'
    | 'AUTH_FAILURE'
    | 'RATE_LIMIT_HIT'
    | 'INVALID_INPUT_REJECTED'
    | 'ANOMALY_DETECTED';

interface SecurityLogParams {
    sessionId?: string;
    ip?: string;
    agentName?: string;
    [key: string]: unknown;
}

export function logSecurityEvent(event: SecurityEventType, params: SecurityLogParams = {}) {
    logger.warn({
        event,
        timestamp: new Date().toISOString(),
        ...params,
    });
}

export function logInfo(event: string, params: Record<string, unknown> = {}) {
    logger.info({
        event,
        timestamp: new Date().toISOString(),
        ...params,
    });
}
