// ASI08: Cascading Failures
import { logSecurityEvent } from '../logger';

export enum CircuitState {
    CLOSED = 'CLOSED',
    OPEN = 'OPEN',
    HALF_OPEN = 'HALF_OPEN',
}

class CircuitBreaker {
    private state = CircuitState.CLOSED;
    private failures = 0;
    private lastFailure = 0;
    private readonly FAILURE_THRESHOLD = 3;
    private readonly RESET_TIMEOUT = 60000;
    private consecutiveSameSeverity = 0;
    private lastSeverity = '';

    recordSuccess() {
        this.failures = 0;
        this.state = CircuitState.CLOSED;
    }

    recordFailure() {
        this.failures++;
        this.lastFailure = Date.now();
        if (this.failures >= this.FAILURE_THRESHOLD) {
            this.state = CircuitState.OPEN;
            logSecurityEvent('CIRCUIT_BREAKER_OPENED', {});
        }
    }

    canAttempt(): boolean {
        if (this.state === CircuitState.CLOSED) return true;
        if (this.state === CircuitState.OPEN && Date.now() - this.lastFailure > this.RESET_TIMEOUT) {
            this.state = CircuitState.HALF_OPEN;
            return true;
        }
        return this.state === CircuitState.HALF_OPEN;
    }

    recordSeverity(severity: string) {
        if (severity === this.lastSeverity) {
            this.consecutiveSameSeverity++;
        } else {
            this.consecutiveSameSeverity = 1;
            this.lastSeverity = severity;
        }
        if (this.consecutiveSameSeverity > 5) {
            logSecurityEvent('ANOMALY_DETECTED', { severity, count: this.consecutiveSameSeverity });
        }
    }

    isOpen(): boolean {
        return this.state === CircuitState.OPEN;
    }

    getState(): CircuitState {
        return this.state;
    }
}

export const triageCircuitBreaker = new CircuitBreaker();
