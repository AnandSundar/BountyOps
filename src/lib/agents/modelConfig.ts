// ASI04: Agentic Supply Chain - Centralized model config
export const MODEL_CONFIG = {
    gpt4o: 'gpt-4o',
    gpt4oMini: 'gpt-4o-mini',
} as const;

export type ModelName = typeof MODEL_CONFIG[keyof typeof MODEL_CONFIG];

export function getModel(name: ModelName = MODEL_CONFIG.gpt4o): string {
    return name; // Always use centralized config, never user input
}
