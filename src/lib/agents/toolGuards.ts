// ASI02: Tool Misuse and Exploitation
import { logSecurityEvent } from '../logger';

interface ToolCallLog {
    tool: string;
    timestamp: number;
    inputSummary: string;
    outputByteSize: number;
}

class RateLimitedToolRegistry {
    private sessionCalls = 0;
    private toolCalls: Record<string, number> = {};
    private sessionBlocked = false;
    private readonly SESSION_LIMIT = 10;
    private readonly TOOL_LIMIT = 3;

    canCallTool(toolName: string): boolean {
        if (this.sessionBlocked) return false;
        if (this.sessionCalls >= this.SESSION_LIMIT) {
            this.sessionBlocked = true;
            logSecurityEvent('TOOL_LIMIT_EXCEEDED', { sessionCalls: this.sessionCalls });
            return false;
        }
        if ((this.toolCalls[toolName] || 0) >= this.TOOL_LIMIT) {
            return false;
        }
        return true;
    }

    recordCall(toolName: string, inputSummary: string, outputSize: number) {
        this.sessionCalls++;
        this.toolCalls[toolName] = (this.toolCalls[toolName] || 0) + 1;
        logSecurityEvent('TOOL_INVOKED', { tool: toolName, inputSummary, outputByteSize: outputSize });
    }

    isBlocked(): boolean {
        return this.sessionBlocked;
    }

    reset() {
        this.sessionCalls = 0;
        this.toolCalls = {};
        this.sessionBlocked = false;
    }
}

export const toolRegistry = new RateLimitedToolRegistry();
