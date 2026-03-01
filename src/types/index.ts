export type Severity = "critical" | "high" | "medium" | "low" | "informational";
export type Status = "open" | "in_progress" | "resolved" | "closed" | "duplicate" | "invalid";
export type VulnerabilityType =
    | "SQL Injection"
    | "XSS"
    | "CSRF"
    | "IDOR"
    | "SSRF"
    | "RCE"
    | "Path Traversal"
    | "Information Disclosure"
    | "Broken Authentication"
    | "Security Misconfiguration"
    | "XML External Entity"
    | "Broken Access Control"
    | "Cryptographic Failures"
    | "Insecure Deserialization"
    | "Using Components with Known Vulnerabilities";

export interface VulnerabilityReport {
    id: string;
    title: string;
    description: string;
    severity: Severity;
    status: Status;
    type: VulnerabilityType;
    target: string;
    researcher: string;
    bounty: number;
    createdAt: string;
    updatedAt: string;
    cvssScore?: number;
    cveId?: string;
    affectedEndpoint: string;
    impact: string;
    stepsToReproduce: string[];
    remediation: string;
    comments: Comment[];
}

export interface Comment {
    id: string;
    author: string;
    content: string;
    createdAt: string;
}

export interface DashboardStats {
    totalReports: number;
    openReports: number;
    resolvedReports: number;
    totalBountyPaid: number;
    avgResponseTime: number;
    criticalVulnerabilities: number;
    highVulnerabilities: number;
    mediumVulnerabilities: number;
    lowVulnerabilities: number;
    informationalVulnerabilities: number;
}

export interface ChartData {
    name: string;
    value: number;
    color?: string;
}

export interface TimelineData {
    date: string;
    reports: number;
    bounties: number;
}
