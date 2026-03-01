// A05: Injection + A08: Integrity Validation
import { z } from 'zod';
import { logSecurityEvent } from './logger';

export const TriageInputSchema = z.object({
    title: z.string().min(5).max(200),
    description: z.string().min(10).max(4000),
    affectedUrl: z.string().url().optional(),
    reporterHandle: z.string().min(1).max(50),
    stepsToReproduce: z.string().max(4000),
});

export const ReportIdSchema = z.string().regex(/^RPT-[0-9]{4}$/);

export const SeveritySchema = z.enum(['critical', 'high', 'medium', 'low', 'informational']);

export const DispositionSchema = z.enum(['valid_bounty', 'duplicate', 'out_of_scope', 'needs_more_info', 'fixed']);

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { valid: boolean; data?: T; error?: string } {
    try {
        const parsed = schema.parse(data);
        return { valid: true, data: parsed };
    } catch (e: unknown) {
        if (e instanceof z.ZodError) {
            const errorMessage = e.issues[0]?.message || 'Validation failed';
            logSecurityEvent('INVALID_INPUT_REJECTED', { error: errorMessage });
            return { valid: false, error: errorMessage };
        }
        return { valid: false, error: 'Validation failed' };
    }
}
