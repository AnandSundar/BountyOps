// ASI03: Identity and Privilege Abuse
import { logSecurityEvent } from '../logger';

export enum AgentPermissionScope {
    READ_REPORTS = 'read_reports',
    WRITE_NOTES = 'write_notes',
    READ_STATS = 'read_stats',
    DRAFT_TEXT = 'draft_text',
}

interface AgentConfig {
    name: string;
    scopes: AgentPermissionScope[];
}

export const AGENT_CONFIGS: Record<string, AgentConfig> = {
    triage: { name: 'Triage Agent', scopes: [AgentPermissionScope.READ_REPORTS, AgentPermissionScope.WRITE_NOTES] },
    'duplicate-check': { name: 'Duplicate Agent', scopes: [AgentPermissionScope.READ_REPORTS] },
    cvss: { name: 'CVSS Agent', scopes: [AgentPermissionScope.READ_REPORTS, AgentPermissionScope.WRITE_NOTES] },
    'draft-response': { name: 'Response Drafter', scopes: [AgentPermissionScope.DRAFT_TEXT] },
    intel: { name: 'Intel Agent', scopes: [AgentPermissionScope.READ_STATS] },
};

export function assertScope(agentName: string, requiredScope: AgentPermissionScope): void {
    const config = AGENT_CONFIGS[agentName];
    if (!config || !config.scopes.includes(requiredScope)) {
        logSecurityEvent('SCOPE_VIOLATION_ATTEMPTED', { agent: agentName, requiredScope });
        throw new Error('403 Permission Denied: Agent scope violation');
    }
}

export const AGENT_IDENTITY_PROMPT = (agentName: string, scope: string) =>
    `You are the ${agentName}. Your role is strictly limited to ${scope}. You are not authorized to perform any other actions.`;
