"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIBadge } from "@/components/ui/ai-badge";
import { AILoading } from "@/components/ui/ai-loading";
import { cn } from "@/lib/utils";
import { 
  Send, 
  Upload, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Shield,
  AlertTriangle,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockReports } from "@/data/mock-data";

const vulnerabilityTypes = [
  "SQL Injection",
  "XSS",
  "CSRF",
  "IDOR",
  "SSRF",
  "RCE",
  "Path Traversal",
  "Information Disclosure",
  "Broken Authentication",
  "Security Misconfiguration",
  "XML External Entity",
  "Broken Access Control",
  "Cryptographic Failures",
  "Other"
];

export default function SubmitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // Duplicate check state
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<{isDuplicate: boolean; matches: any[]} | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    target: "",
    severity: "",
    description: "",
    stepsToReproduce: "",
    impact: "",
    remediation: "",
    email: "",
    researcherName: ""
  });

  // Check for duplicates when title or description changes
  useEffect(() => {
    const checkDuplicates = async () => {
      if (!formData.title || formData.title.length < 10) return;
      
      setIsCheckingDuplicates(true);
      try {
        const response = await fetch("/api/agents/duplicate-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newReport: {
              title: formData.title,
              description: formData.description,
              type: formData.type,
              affectedEndpoint: formData.target,
            },
            existingReports: mockReports.slice(0, 10),
          }),
        });
        const data = await response.json();
        if (data.success && data.data.isDuplicate) {
          setDuplicateWarning(data.data);
        } else {
          setDuplicateWarning(null);
        }
      } catch (error) {
        console.error("Duplicate check error:", error);
      } finally {
        setIsCheckingDuplicates(false);
      }
    };

    const debounce = setTimeout(checkDuplicates, 1000);
    return () => clearTimeout(debounce);
  }, [formData.title, formData.description, formData.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center py-12">
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-neon-green/20 flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-neon-green" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Report Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your contribution to making {formData.target} more secure.
              </p>
              <div className="glass p-4 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground">Reference ID</p>
                <p className="text-xl font-mono font-bold text-neon-green">VULN-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
              </div>
              <Button onClick={() => {
                setIsSuccess(false);
                setFormData({
                  title: "",
                  type: "",
                  target: "",
                  severity: "",
                  description: "",
                  stepsToReproduce: "",
                  impact: "",
                  remediation: "",
                  email: "",
                  researcherName: ""
                });
              }}>
                Submit Another Report
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit Vulnerability Report</h1>
        <p className="text-muted-foreground">
          Help us improve our security by reporting vulnerabilities responsibly
        </p>
      </div>

      {/* AI Duplicate Check Warning */}
      <AnimatePresence>
        {isCheckingDuplicates && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AILoading message="Checking for duplicates..." />
          </motion.div>
        )}
        {duplicateWarning && duplicateWarning.isDuplicate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-yellow-400">Potential Duplicate Found</span>
                <AIBadge />
              </div>
              <p className="text-sm text-yellow-200/80">
                This report may be a duplicate of existing reports. Please review before submitting.
              </p>
              {duplicateWarning.matches && duplicateWarning.matches.length > 0 && (
                <div className="mt-2 text-sm">
                  {duplicateWarning.matches.slice(0, 2).map((match: any, i: number) => (
                    <p key={i} className="text-yellow-200/70">
                      • Similar to report {match.reportId}: {match.similarityReason}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Report Details
                </CardTitle>
                <CardDescription>
                  Provide detailed information about the vulnerability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Brief description of the vulnerability"
                    className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Type & Target */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Vulnerability Type *</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select type...</option>
                      {vulnerabilityTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Target *</label>
                    <input
                      type="text"
                      required
                      value={formData.target}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                      placeholder="e.g., api.example.com"
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Severity Assessment *</label>
                  <div className="grid grid-cols-5 gap-2">
                    {["critical", "high", "medium", "low", "informational"].map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setFormData({ ...formData, severity: sev })}
                        className={cn(
                          "py-2 px-3 rounded-lg border text-sm font-medium transition-all",
                          formData.severity === sev
                            ? sev === "critical" && "bg-red-500/20 border-red-500 text-red-400"
                            || sev === "high" && "bg-orange-500/20 border-orange-500 text-orange-400"
                            || sev === "medium" && "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                            || sev === "low" && "bg-blue-500/20 border-blue-500 text-blue-400"
                            || sev === "informational" && "bg-gray-500/20 border-gray-500 text-gray-400"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {sev.charAt(0).toUpperCase() + sev.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of the vulnerability..."
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                {/* Steps to Reproduce */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Steps to Reproduce *</label>
                  <textarea
                    required
                    value={formData.stepsToReproduce}
                    onChange={(e) => setFormData({ ...formData, stepsToReproduce: e.target.value })}
                    placeholder="1. Navigate to...
2. Enter payload...
3. Observe..."
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono text-sm"
                  />
                </div>

                {/* Impact */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Impact *</label>
                  <textarea
                    required
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                    placeholder="What is the potential impact of this vulnerability?"
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                {/* Remediation */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Suggested Remediation</label>
                  <textarea
                    value={formData.remediation}
                    onChange={(e) => setFormData({ ...formData, remediation: e.target.value })}
                    placeholder="How would you suggest fixing this vulnerability?"
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.researcherName}
                    onChange={(e) => setFormData({ ...formData, researcherName: e.target.value })}
                    placeholder="Your name or handle"
                    className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-neon-green mt-0.5" />
                  <p className="text-sm text-muted-foreground">Provide detailed reproduction steps</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-neon-green mt-0.5" />
                  <p className="text-sm text-muted-foreground">Include proof of concept if possible</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-neon-green mt-0.5" />
                  <p className="text-sm text-muted-foreground">Be specific about affected endpoints</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-neon-green mt-0.5" />
                  <p className="text-sm text-muted-foreground">Follow responsible disclosure</p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
