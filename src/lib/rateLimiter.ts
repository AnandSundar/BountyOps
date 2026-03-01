// A06: Insecure Design - Rate Limiting
import { logSecurityEvent } from './logger';

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const MAX_SUBMISSIONS_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000;

export function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return true;
    }

    if (entry.count >= MAX_SUBMISSIONS_PER_HOUR) {
        logSecurityEvent('RATE_LIMIT_HIT', { ip });
        return false;
    }

    entry.count++;
    return true;
}
