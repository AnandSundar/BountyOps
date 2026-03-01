import { VulnerabilityReport, DashboardStats, ChartData, TimelineData } from "@/types";

export const mockReports: VulnerabilityReport[] = [
    {
        id: "vuln-001",
        title: "SQL Injection in User Search Endpoint",
        description: "The user search endpoint at /api/users/search is vulnerable to SQL injection attacks. An attacker can manipulate the search parameter to execute arbitrary SQL queries.",
        severity: "critical",
        status: "open",
        type: "SQL Injection",
        target: "api.acme-platform.com",
        researcher: "security_hunter_42",
        bounty: 5000,
        createdAt: "2026-02-28T10:30:00Z",
        updatedAt: "2026-02-28T14:22:00Z",
        cvssScore: 9.8,
        affectedEndpoint: "GET /api/users/search?q=<payload>",
        impact: "Full database compromise, potential data exfiltration of all user data including credentials",
        stepsToReproduce: [
            "Navigate to the user search page",
            "Enter payload: ' OR 1=1-- in the search box",
            "Observe that all user records are returned",
            "Use SQLmap to confirm vulnerability"
        ],
        remediation: "Use parameterized queries or prepared statements. Implement input validation.",
        comments: [
            { id: "c1", author: "security_hunter_42", content: "This is a critical finding. Immediate attention required.", createdAt: "2026-02-28T11:00:00Z" }
        ]
    },
    {
        id: "vuln-002",
        title: "Stored XSS in Profile Bio Field",
        description: "The user profile bio field does not properly sanitize input, allowing stored XSS attacks.",
        severity: "high",
        status: "in_progress",
        type: "XSS",
        target: "app.acme-platform.com",
        researcher: "xss_master",
        bounty: 2500,
        createdAt: "2026-02-27T09:15:00Z",
        updatedAt: "2026-02-28T08:30:00Z",
        cvssScore: 7.2,
        affectedEndpoint: "POST /api/profile/update - bio field",
        impact: "Session hijacking, cookie theft, defacement of other user profiles",
        stepsToReproduce: [
            "Navigate to profile settings",
            "Set bio to: <script>alert(document.cookie)</script>",
            "Save profile",
            "Visit any page displaying the user bio"
        ],
        remediation: "Implement output encoding and content security policy headers.",
        comments: []
    },
    {
        id: "vuln-003",
        title: "IDOR Allowing Access to Private Documents",
        description: "Insecure Direct Object Reference allows attackers to access private documents by modifying document IDs.",
        severity: "high",
        status: "open",
        type: "IDOR",
        target: "docs.acme-platform.com",
        researcher: "bug_bounty_ninja",
        bounty: 3000,
        createdAt: "2026-02-26T14:45:00Z",
        updatedAt: "2026-02-26T14:45:00Z",
        cvssScore: 7.5,
        affectedEndpoint: "GET /api/documents/{id}",
        impact: "Unauthorized access to sensitive corporate documents",
        stepsToReproduce: [
            "Login as regular user",
            "Access document with ID 1",
            "Increment ID to access other users' documents"
        ],
        remediation: "Implement proper authorization checks for all resources.",
        comments: []
    },
    {
        id: "vuln-004",
        title: "SSRF in Image Upload Feature",
        description: "The image upload feature fetches images from URLs without proper validation, allowing Server-Side Request Forgery.",
        severity: "critical",
        status: "open",
        type: "SSRF",
        target: "api.acme-platform.com",
        researcher: "cloud_security_expert",
        bounty: 7500,
        createdAt: "2026-02-25T11:20:00Z",
        updatedAt: "2026-02-25T16:00:00Z",
        cvssScore: 9.1,
        cveId: "CVE-2026-1234",
        affectedEndpoint: "POST /api/upload/from-url",
        impact: "Access to internal services, cloud metadata, potential RCE",
        stepsToReproduce: [
            "Navigate to image upload",
            "Select 'Upload from URL'",
            "Enter: http://169.254.169.254/latest/meta-data/"
        ],
        remediation: "Implement URL validation, block internal IP ranges.",
        comments: []
    },
    {
        id: "vuln-005",
        title: "Broken Authentication - Password Reset Flaw",
        description: "The password reset mechanism does not verify the user's identity properly before allowing password change.",
        severity: "critical",
        status: "resolved",
        type: "Broken Authentication",
        target: "auth.acme-platform.com",
        researcher: "auth_hacker",
        bounty: 4000,
        createdAt: "2026-02-24T08:00:00Z",
        updatedAt: "2026-02-27T10:00:00Z",
        cvssScore: 8.1,
        affectedEndpoint: "POST /api/auth/reset-password",
        impact: "Account takeover of any user",
        stepsToReproduce: [
            "Request password reset for target email",
            "Intercept the reset token request",
            "Modify the email parameter to victim@acme.com"
        ],
        remediation: "Implement proper token validation and email verification.",
        comments: []
    },
    {
        id: "vuln-006",
        title: "Information Disclosure in Error Messages",
        description: "Detailed error messages expose stack traces and internal system information.",
        severity: "medium",
        status: "closed",
        type: "Information Disclosure",
        target: "api.acme-platform.com",
        researcher: "error_hunter",
        bounty: 500,
        createdAt: "2026-02-23T16:30:00Z",
        updatedAt: "2026-02-25T09:00:00Z",
        cvssScore: 4.3,
        affectedEndpoint: "All API endpoints",
        impact: "Information disclosure aiding further attacks",
        stepsToReproduce: [
            "Send malformed requests to API",
            "Observe detailed error responses"
        ],
        remediation: "Implement generic error messages in production.",
        comments: []
    },
    {
        id: "vuln-007",
        title: "CSRF Token Missing on Sensitive Actions",
        description: "Critical actions lack CSRF protection, allowing cross-site request forgery attacks.",
        severity: "high",
        status: "in_progress",
        type: "CSRF",
        target: "app.acme-platform.com",
        researcher: "csrf_expert",
        bounty: 2000,
        createdAt: "2026-02-22T13:45:00Z",
        updatedAt: "2026-02-28T11:00:00Z",
        cvssScore: 6.8,
        affectedEndpoint: "POST /api/settings/update, POST /api/transfer",
        impact: "Unauthorized state-changing actions on behalf of authenticated users",
        stepsToReproduce: [
            "Create malicious page with form auto-submit",
            "Lure authenticated user to visit page",
            "Observe unauthorized action execution"
        ],
        remediation: "Implement CSRF tokens for all state-changing operations.",
        comments: []
    },
    {
        id: "vuln-008",
        title: "Path Traversal in File Download",
        description: "The file download functionality is vulnerable to path traversal attacks.",
        severity: "high",
        status: "open",
        type: "Path Traversal",
        target: "files.acme-platform.com",
        researcher: "file_exploiter",
        bounty: 3500,
        createdAt: "2026-02-21T10:00:00Z",
        updatedAt: "2026-02-21T10:00:00Z",
        cvssScore: 7.4,
        affectedEndpoint: "GET /api/files/download?file=../../etc/passwd",
        impact: "Read arbitrary files on the server",
        stepsToReproduce: [
            "Navigate to file download",
            "Enter ../../etc/passwd as filename"
        ],
        remediation: "Validate and sanitize file paths, use whitelisting.",
        comments: []
    },
    {
        id: "vuln-009",
        title: "XXE Vulnerability in XML Parser",
        description: "The XML parser is vulnerable to XML External Entity attacks.",
        severity: "critical",
        status: "open",
        type: "XML External Entity",
        target: "api.acme-platform.com",
        researcher: "xml_attacker",
        bounty: 6000,
        createdAt: "2026-02-20T15:30:00Z",
        updatedAt: "2026-02-20T15:30:00Z",
        cvssScore: 9.0,
        affectedEndpoint: "POST /api/import",
        impact: "Disclosure of internal files, SSRF, denial of service",
        stepsToReproduce: [
            "Upload XML file with XXE payload",
            "Parse the file on server"
        ],
        remediation: "Disable XML external entity processing.",
        comments: []
    },
    {
        id: "vuln-010",
        title: "Insecure Deserialization in API",
        description: "The API uses insecure deserialization allowing remote code execution.",
        severity: "critical",
        status: "open",
        type: "Insecure Deserialization",
        target: "api.acme-platform.com",
        researcher: "rce_specialist",
        bounty: 10000,
        createdAt: "2026-02-19T09:00:00Z",
        updatedAt: "2026-02-19T09:00:00Z",
        cvssScore: 10.0,
        affectedEndpoint: "POST /api/data/deserialize",
        impact: "Complete system compromise, remote code execution",
        stepsToReproduce: [
            "Send malicious serialized payload",
            "Gain shell access to server"
        ],
        remediation: "Use safe serialization methods, implement integrity checks.",
        comments: []
    },
    {
        id: "vuln-011",
        title: "JWT Token Not Validated",
        description: "JWT tokens are accepted without proper signature validation.",
        severity: "critical",
        status: "resolved",
        type: "Broken Authentication",
        target: "auth.acme-platform.com",
        researcher: "jwt_hacker",
        bounty: 4500,
        createdAt: "2026-02-18T14:20:00Z",
        updatedAt: "2026-02-22T10:00:00Z",
        cvssScore: 9.5,
        affectedEndpoint: "All authenticated endpoints",
        impact: "Complete authentication bypass, account takeover",
        stepsToReproduce: [
            "Create JWT with algorithm 'none'",
            "Set arbitrary user ID in payload"
        ],
        remediation: "Properly validate JWT signatures, whitelist algorithms.",
        comments: []
    },
    {
        id: "vuln-012",
        title: "Sensitive Data in URL Parameters",
        description: "Sensitive data is being transmitted in URL parameters.",
        severity: "medium",
        status: "in_progress",
        type: "Information Disclosure",
        target: "app.acme-platform.com",
        researcher: "privacy_advocate",
        bounty: 800,
        createdAt: "2026-02-17T11:45:00Z",
        updatedAt: "2026-02-28T09:00:00Z",
        cvssScore: 5.3,
        affectedEndpoint: "GET /api/users?id=123&token=secret",
        impact: "Token leakage through logs and browser history",
        stepsToReproduce: [
            "Login to application",
            "Observe URL contains sensitive tokens"
        ],
        remediation: "Use POST requests for sensitive data, implement proper session management.",
        comments: []
    },
    {
        id: "vuln-013",
        title: "Reflected XSS in Search Results",
        description: "Search query is reflected in the response without proper encoding.",
        severity: "medium",
        status: "open",
        type: "XSS",
        target: "app.acme-platform.com",
        researcher: "xss_finder",
        bounty: 1500,
        createdAt: "2026-02-16T08:30:00Z",
        updatedAt: "2026-02-16T08:30:00Z",
        cvssScore: 6.1,
        affectedEndpoint: "GET /search?q=<script>alert(1)</script>",
        impact: "Session hijacking via reflected XSS",
        stepsToReproduce: [
            "Enter XSS payload in search box",
            "Observe script execution in results page"
        ],
        remediation: "Implement output encoding for all user input.",
        comments: []
    },
    {
        id: "vuln-014",
        title: "Security Misconfiguration - CORS Allow All",
        description: "CORS is configured to allow all origins without restrictions.",
        severity: "medium",
        status: "closed",
        type: "Security Misconfiguration",
        target: "api.acme-platform.com",
        researcher: "cors_expert",
        bounty: 1000,
        createdAt: "2026-02-15T16:00:00Z",
        updatedAt: "2026-02-18T12:00:00Z",
        cvssScore: 5.3,
        affectedEndpoint: "All API endpoints",
        impact: "Data exfiltration via cross-origin requests",
        stepsToReproduce: [
            "Send request with arbitrary Origin header",
            "Observe Access-Control-Allow-Origin: *"
        ],
        remediation: "Implement proper CORS policy with whitelist.",
        comments: []
    },
    {
        id: "vuln-015",
        title: "Broken Access Control - Admin Functions Exposed",
        description: "Admin functions are accessible to regular users without authorization.",
        severity: "high",
        status: "open",
        type: "Broken Access Control",
        target: "admin.acme-platform.com",
        researcher: "access_control_hunter",
        bounty: 3000,
        createdAt: "2026-02-14T12:00:00Z",
        updatedAt: "2026-02-14T12:00:00Z",
        cvssScore: 7.8,
        affectedEndpoint: "POST /api/admin/*",
        impact: "Unauthorized access to administrative functions",
        stepsToReproduce: [
            "Login as regular user",
            "Access admin endpoints directly"
        ],
        remediation: "Implement proper role-based access control.",
        comments: []
    },
    {
        id: "vuln-016",
        title: "Weak Password Policy",
        description: "The application allows weak passwords without proper complexity requirements.",
        severity: "low",
        status: "open",
        type: "Cryptographic Failures",
        target: "auth.acme-platform.com",
        researcher: "password_policy_tester",
        bounty: 200,
        createdAt: "2026-02-13T10:30:00Z",
        updatedAt: "2026-02-13T10:30:00Z",
        cvssScore: 3.1,
        affectedEndpoint: "POST /api/auth/register",
        impact: "Increased risk of credential compromise",
        stepsToReproduce: [
            "Try to register with password '123456'",
            "Observe registration succeeds"
        ],
        remediation: "Implement strong password policy.",
        comments: []
    },
    {
        id: "vuln-017",
        title: "Race Condition in Payment Processing",
        description: "Race condition allows double spending in payment processing.",
        severity: "critical",
        status: "open",
        type: "Security Misconfiguration",
        target: "payments.acme-platform.com",
        researcher: "race_condition_expert",
        bounty: 8000,
        createdAt: "2026-02-12T14:00:00Z",
        updatedAt: "2026-02-12T14:00:00Z",
        cvssScore: 8.9,
        affectedEndpoint: "POST /api/payments/process",
        impact: "Financial loss through double spending",
        stepsToReproduce: [
            "Send multiple concurrent payment requests",
            "Observe funds deducted only once"
        ],
        remediation: "Implement proper transaction atomicity.",
        comments: []
    },
    {
        id: "vuln-018",
        title: "DOM-based XSS in Dashboard",
        description: "DOM-based XSS vulnerability in the main dashboard.",
        severity: "medium",
        status: "in_progress",
        type: "XSS",
        target: "app.acme-platform.com",
        researcher: "dom_xss_hunter",
        bounty: 1200,
        createdAt: "2026-02-11T09:15:00Z",
        updatedAt: "2026-02-26T15:00:00Z",
        cvssScore: 6.1,
        affectedEndpoint: "GET /dashboard#<script>alert(1)</script>",
        impact: "Session hijacking through DOM manipulation",
        stepsToReproduce: [
            "Navigate to dashboard",
            "Observe hash parameter reflected in DOM"
        ],
        remediation: "Implement DOM sanitization.",
        comments: []
    },
    {
        id: "vuln-019",
        title: "Privilege Escalation via API Parameter",
        description: "Users can escalate privileges by modifying API parameters.",
        severity: "high",
        status: "open",
        type: "Broken Access Control",
        target: "api.acme-platform.com",
        researcher: "privilege_escalator",
        bounty: 2800,
        createdAt: "2026-02-10T11:00:00Z",
        updatedAt: "2026-02-10T11:00:00Z",
        cvssScore: 7.6,
        affectedEndpoint: "POST /api/users/update",
        impact: "Unauthorized access to admin features",
        stepsToReproduce: [
            "Modify role parameter in user update request"
        ],
        remediation: "Validate user permissions server-side.",
        comments: []
    },
    {
        id: "vuln-020",
        title: "OAuth 2.0 Token Leakage",
        description: "OAuth tokens are leaked in URL fragments.",
        severity: "high",
        status: "resolved",
        type: "Broken Authentication",
        target: "auth.acme-platform.com",
        researcher: "oauth_expert",
        bounty: 2200,
        createdAt: "2026-02-09T08:45:00Z",
        updatedAt: "2026-02-15T10:00:00Z",
        cvssScore: 7.2,
        affectedEndpoint: "OAuth callback endpoint",
        impact: "Token theft via browser history or referer header",
        stepsToReproduce: [
            "Complete OAuth flow",
            "Observe token in URL fragment"
        ],
        remediation: "Use state parameter, implement token rotation.",
        comments: []
    },
    {
        id: "vuln-021",
        title: "Directory Listing Enabled",
        description: "Directory listing is enabled on the uploads directory.",
        severity: "low",
        status: "closed",
        type: "Information Disclosure",
        target: "files.acme-platform.com",
        researcher: "directory_lister",
        bounty: 300,
        createdAt: "2026-02-08T15:30:00Z",
        updatedAt: "2026-02-10T09:00:00Z",
        cvssScore: 3.5,
        affectedEndpoint: "GET /uploads/",
        impact: "Disclosure of file structure and sensitive files",
        stepsToReproduce: [
            "Navigate to /uploads/",
            "Observe file listing"
        ],
        remediation: "Disable directory listing.",
        comments: []
    },
    {
        id: "vuln-022",
        title: "Clickjacking Vulnerability",
        description: "Application is vulnerable to clickjacking attacks.",
        severity: "medium",
        status: "open",
        type: "Security Misconfiguration",
        target: "app.acme-platform.com",
        researcher: "clickjacker",
        bounty: 900,
        createdAt: "2026-02-07T12:15:00Z",
        updatedAt: "2026-02-07T12:15:00Z",
        cvssScore: 5.4,
        affectedEndpoint: "All pages",
        impact: "Users tricked into clicking unintended actions",
        stepsToReproduce: [
            "Create iframe with target site",
            "Overlay with deceptive content"
        ],
        remediation: "Implement X-Frame-Options header.",
        comments: []
    },
    {
        id: "vuln-023",
        title: "API Rate Limiting Missing",
        description: "API endpoints lack rate limiting, vulnerable to abuse.",
        severity: "medium",
        status: "in_progress",
        type: "Security Misconfiguration",
        target: "api.acme-platform.com",
        researcher: "rate_limit_buster",
        bounty: 600,
        createdAt: "2026-02-06T10:00:00Z",
        updatedAt: "2026-02-28T08:00:00Z",
        cvssScore: 5.0,
        affectedEndpoint: "POST /api/login",
        impact: "Brute force attacks, denial of service",
        stepsToReproduce: [
            "Send thousands of login requests",
            "Observe no blocking occurs"
        ],
        remediation: "Implement rate limiting on all endpoints.",
        comments: []
    },
    {
        id: "vuln-024",
        title: "Unencrypted Data in Transit",
        description: "Some endpoints do not enforce HTTPS.",
        severity: "medium",
        status: "open",
        type: "Cryptographic Failures",
        target: "acme-platform.com",
        researcher: "ssl_tester",
        bounty: 700,
        createdAt: "2026-02-05T14:30:00Z",
        updatedAt: "2026-02-05T14:30:00Z",
        cvssScore: 5.5,
        affectedEndpoint: "http://acme-platform.com/*",
        impact: "Man-in-the-middle attacks possible",
        stepsToReproduce: [
            "Access site over HTTP",
            "Observe data transmitted unencrypted"
        ],
        remediation: "Enforce HTTPS, implement HSTS.",
        comments: []
    },
    {
        id: "vuln-025",
        title: "Sensitive Cookies Without Secure Flag",
        description: "Session cookies are not marked as secure.",
        severity: "medium",
        status: "closed",
        type: "Cryptographic Failures",
        target: "app.acme-platform.com",
        researcher: "cookie_monster",
        bounty: 400,
        createdAt: "2026-02-04T09:45:00Z",
        updatedAt: "2026-02-08T11:00:00Z",
        cvssScore: 4.8,
        affectedEndpoint: "All authenticated pages",
        impact: "Cookie theft over unencrypted connections",
        stepsToReproduce: [
            "Check session cookie flags",
            "Observe Secure flag is missing"
        ],
        remediation: "Set Secure flag on sensitive cookies.",
        comments: []
    },
    {
        id: "vuln-026",
        title: "Content Security Policy Not Implemented",
        description: "Application lacks Content Security Policy headers.",
        severity: "medium",
        status: "open",
        type: "Security Misconfiguration",
        target: "app.acme-platform.com",
        researcher: "csp_tester",
        bounty: 500,
        createdAt: "2026-02-03T11:20:00Z",
        updatedAt: "2026-02-03T11:20:00Z",
        cvssScore: 4.5,
        affectedEndpoint: "All pages",
        impact: "XSS and data injection attacks easier to exploit",
        stepsToReproduce: [
            "Check response headers",
            "Observe CSP header is missing"
        ],
        remediation: "Implement strict Content Security Policy.",
        comments: []
    },
    {
        id: "vuln-027",
        title: "Improper Input Validation in File Upload",
        description: "File upload accepts dangerous file types without validation.",
        severity: "high",
        status: "open",
        type: "Security Misconfiguration",
        target: "uploads.acme-platform.com",
        researcher: "upload_exploiter",
        bounty: 3200,
        createdAt: "2026-02-02T13:00:00Z",
        updatedAt: "2026-02-02T13:00:00Z",
        cvssScore: 7.3,
        affectedEndpoint: "POST /api/upload",
        impact: "Remote code execution via uploaded files",
        stepsToReproduce: [
            "Upload PHP shell disguised as image"
        ],
        remediation: "Validate file types, store outside web root.",
        comments: []
    },
    {
        id: "vuln-028",
        title: "Hardcoded API Keys in Source",
        description: "API keys found in JavaScript source code.",
        severity: "critical",
        status: "resolved",
        type: "Information Disclosure",
        target: "app.acme-platform.com",
        researcher: "secret_finder",
        bounty: 2500,
        createdAt: "2026-02-01T10:15:00Z",
        updatedAt: "2026-02-05T14:00:00Z",
        cvssScore: 8.6,
        affectedEndpoint: "JavaScript bundles",
        impact: "Full access to third-party services",
        stepsToReproduce: [
            "Inspect JavaScript source",
            "Find API keys in code"
        ],
        remediation: "Use environment variables, implement proper secrets management.",
        comments: []
    },
    {
        id: "vuln-029",
        title: "WebSocket Security Issues",
        description: "WebSocket connections lack proper authentication.",
        severity: "medium",
        status: "open",
        type: "Broken Authentication",
        target: "ws.acme-platform.com",
        researcher: "websocket_hacker",
        bounty: 1100,
        createdAt: "2026-01-31T16:45:00Z",
        updatedAt: "2026-01-31T16:45:00Z",
        cvssScore: 5.8,
        affectedEndpoint: "WebSocket endpoints",
        impact: "Unauthorized real-time data access",
        stepsToReproduce: [
            "Connect to WebSocket without auth token"
        ],
        remediation: "Implement WebSocket authentication.",
        comments: []
    },
    {
        id: "vuln-030",
        title: "Version Disclosure via HTTP Headers",
        description: "Server version information exposed in HTTP headers.",
        severity: "informational",
        status: "closed",
        type: "Information Disclosure",
        target: "api.acme-platform.com",
        researcher: "header_hunter",
        bounty: 100,
        createdAt: "2026-01-30T08:00:00Z",
        updatedAt: "2026-02-02T10:00:00Z",
        cvssScore: 1.0,
        affectedEndpoint: "All endpoints",
        impact: "Information disclosure aiding targeted attacks",
        stepsToReproduce: [
            "Check Server header",
            "Observe version information"
        ],
        remediation: "Configure server to hide version info.",
        comments: []
    }
];

export const mockDashboardStats: DashboardStats = {
    totalReports: 30,
    openReports: 16,
    resolvedReports: 6,
    totalBountyPaid: 89500,
    avgResponseTime: 2.3,
    criticalVulnerabilities: 7,
    highVulnerabilities: 9,
    mediumVulnerabilities: 10,
    lowVulnerabilities: 3,
    informationalVulnerabilities: 1
};

export const mockSeverityDistribution: ChartData[] = [
    { name: "Critical", value: 7, color: "#ef4444" },
    { name: "High", value: 9, color: "#f97316" },
    { name: "Medium", value: 10, color: "#eab308" },
    { name: "Low", value: 3, color: "#3b82f6" },
    { name: "Info", value: 1, color: "#6b7280" }
];

export const mockStatusDistribution: ChartData[] = [
    { name: "Open", value: 16, color: "#10B981" },
    { name: "In Progress", value: 4, color: "#06B6D4" },
    { name: "Resolved", value: 6, color: "#3b82f6" },
    { name: "Closed", value: 4, color: "#6b7280" }
];

export const mockTimelineData: TimelineData[] = [
    { date: "2026-01", reports: 8, bounties: 15000 },
    { date: "2026-02", reports: 22, bounties: 74500 },
    { date: "2026-03", reports: 12, bounties: 28000 }
];

export const mockMonthlyTrends = [
    { name: "Jan", reports: 8, resolved: 2 },
    { name: "Feb", reports: 22, resolved: 4 },
    { name: "Mar", reports: 12, resolved: 8 }
];
