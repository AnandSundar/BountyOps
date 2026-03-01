"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { 
  X, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  Info,
  ChevronDown,
  MessageSquare,
  Clock,
  Shield,
  Target,
  User,
  Calendar,
  Link2,
  CheckSquare,
  Square,
  FileText,
  Send,
  Archive,
  XCircle,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { VulnerabilityReport, Severity, Status } from "@/types";

// CVSS Calculation Types
type AttackVector = "network" | "adjacent" | "local" | "physical";
type AttackComplexity = "low" | "high";
type Scope = "unchanged" | "changed";
type Confidentiality = "none" | "low" | "high";
type Integrity = "none" | "low" | "high";
type Availability = "none" | "low" | "high";

interface ReportDetailProps {
  report: VulnerabilityReport | null;
  isOpen: boolean;
  onClose: () => void;
}

// CVSS Base Score Weights
const cvssWeights = {
  attackVector: { network: 0.85, adjacent: 0.62, local: 0.55, physical: 0.2 },
  attackComplexity: { low: 0.77, high: 0.44 },
  scope: { unchanged: 1, changed: 1.08 },
  confidentiality: { none: 0, low: 0.22, high: 0.56 },
  integrity: { none: 0, low: 0.22, high: 0.56 },
  availability: { none: 0, low: 0.22, high: 0.56 }
};

const calculateCVSS = (
  attackVector: AttackVector,
  attackComplexity: AttackComplexity,
  scope: Scope,
  confidentiality: Confidentiality,
  integrity: Integrity,
  availability: Availability
): number => {
  const ISS = 1 - (
    (1 - cvssWeights.confidentiality[confidentiality]) *
    (1 - cvssWeights.integrity[integrity]) *
    (1 - cvssWeights.availability[availability])
  );
  
  const impact = scope === "changed" 
    ? 1.08 * ISS 
    : ISS;
  
  const exploitability = (
    cvssWeights.attackVector[attackVector] *
    cvssWeights.attackComplexity[attackComplexity] *
    0.91
  );
  
  let baseScore = 0;
  if (impact <= 0) {
    baseScore = 0;
  } else if (scope === "changed") {
    baseScore = Math.min(1.08 * (impact + exploitability), 10);
  } else {
    baseScore = Math.min(impact + exploitability, 10);
  }
  
  return Math.round(baseScore * 10) / 10;
};

const getSeverityFromCVSS = (score: number): Severity => {
  if (score >= 9.0) return "critical";
  if (score >= 7.0) return "high";
  if (score >= 4.0) return "medium";
  if (score >= 0.1) return "low";
  return "informational";
};

// Reproduction steps with checkboxes
const reproductionSteps = [
  { id: 1, text: "Confirm endpoint exists and is accessible", checked: false },
  { id: 2, text: "Reproduce as unauthenticated user", checked: false },
  { id: 3, text: "Confirm data exposure or vulnerability", checked: false },
  { id: 4, text: "Document exact request/response", checked: false },
  { id: 5, text: "Test with multiple payloads", checked: false },
  { id: 6, text: "Verify business impact", checked: false }
];

export function ReportDetail({ report, isOpen, onClose }: ReportDetailProps) {
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [internalNotes, setInternalNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  
  // CVSS Calculator State
  const [attackVector, setAttackVector] = useState<AttackVector>("network");
  const [attackComplexity, setAttackComplexity] = useState<AttackComplexity>("low");
  const [scope, setScope] = useState<Scope>("unchanged");
  const [confidentiality, setConfidentiality] = useState<Confidentiality>("high");
  const [integrity, setIntegrity] = useState<Integrity>("low");
  const [availability, setAvailability] = useState<Availability>("low");
  const [calculatedCVSS, setCalculatedCVSS] = useState(0);

  useEffect(() => {
    const score = calculateCVSS(
      attackVector,
      attackComplexity,
      scope,
      confidentiality,
      integrity,
      availability
    );
    setCalculatedCVSS(score);
  }, [attackVector, attackComplexity, scope, confidentiality, integrity, availability]);

  useEffect(() => {
    if (report) {
      // Reset state when report changes
      setCheckedSteps([]);
      setInternalNotes("");
      setCalculatedCVSS(report.cvssScore || 0);
    }
  }, [report]);

  const toggleStep = (stepId: number) => {
    setCheckedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "informational": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "open": return "bg-neon-green/20 text-neon-green border-neon-green/30";
      case "in_progress": return "bg-neon-teal/20 text-neon-teal border-neon-teal/30";
      case "resolved": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "closed": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "duplicate": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "invalid": return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCVSSColor = (score: number) => {
    if (score >= 9.0) return "text-red-500 bg-red-500/20";
    if (score >= 7.0) return "text-orange-500 bg-orange-500/20";
    if (score >= 4.0) return "text-yellow-500 bg-yellow-500/20";
    if (score >= 0.1) return "text-blue-500 bg-blue-500/20";
    return "text-gray-500 bg-gray-500/20";
  };

  if (!report) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full max-w-4xl bg-slate-900 border-l border-white/10 z-50 overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/80 backdrop-blur">
              <div>
                <h2 className="text-xl font-bold">Report Details</h2>
                <p className="text-sm text-muted-foreground">{report.id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Report Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={cn("border", getSeverityColor(report.severity))}>
                          {report.severity}
                        </Badge>
                        <Badge variant="glass" className={cn("border", getStatusColor(report.status))}>
                          {formatStatus(report.status)}
                        </Badge>
                        <Badge variant="outline">{report.type}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-neon-green">{formatCurrency(report.bounty)}</p>
                      <p className="text-sm text-muted-foreground">Bounty</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Researcher:</span>
                      <span className="font-medium">{report.researcher}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Created:</span>
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Target:</span>
                      <span className="font-medium">{report.target}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Endpoint:</span>
                      <span className="font-mono text-xs">{report.affectedEndpoint}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{report.description}</p>
                </CardContent>
              </Card>

              {/* Reproduction Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" />
                    Reproduction Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reproductionSteps.map((step) => (
                      <div 
                        key={step.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                          checkedSteps.includes(step.id) 
                            ? "bg-neon-green/10 border border-neon-green/30" 
                            : "bg-white/5 hover:bg-white/10"
                        )}
                        onClick={() => toggleStep(step.id)}
                      >
                        {checkedSteps.includes(step.id) ? (
                          <CheckSquare className="w-5 h-5 text-neon-green" />
                        ) : (
                          <Square className="w-5 h-5 text-muted-foreground" />
                        )}
                        <span className={cn(
                          "text-sm",
                          checkedSteps.includes(step.id) && "text-neon-green line-through"
                        )}>
                          {step.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Progress: {checkedSteps.length}/{reproductionSteps.length} steps completed
                  </div>
                </CardContent>
              </Card>

              {/* Impact Scorer - CVSS Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Impact Scorer (CVSS 3.1)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Attack Vector */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Attack Vector</label>
                      <select
                        value={attackVector}
                        onChange={(e) => setAttackVector(e.target.value as AttackVector)}
                        className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm"
                      >
                        <option value="network">Network</option>
                        <option value="adjacent">Adjacent</option>
                        <option value="local">Local</option>
                        <option value="physical">Physical</option>
                      </select>
                    </div>

                    {/* Attack Complexity */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Attack Complexity</label>
                      <select
                        value={attackComplexity}
                        onChange={(e) => setAttackComplexity(e.target.value as AttackComplexity)}
                        className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {/* Scope */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Scope</label>
                      <select
                        value={scope}
                        onChange={(e) => setScope(e.target.value as Scope)}
                        className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm"
                      >
                        <option value="unchanged">Unchanged</option>
                        <option value="changed">Changed</option>
                      </select>
                    </div>

                    {/* Confidentiality */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Confidentiality</label>
                      <select
                        value={confidentiality}
                        onChange={(e) => setConfidentiality(e.target.value as Confidentiality)}
                        className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm"
                      >
                        <option value="none">None</option>
                        <option value="low">Low</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {/* Integrity */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Integrity</label>
                      <select
                        value={integrity}
                        onChange={(e) => setIntegrity(e.target.value as Integrity)}
                        className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm"
                      >
                        <option value="none">None</option>
                        <option value="low">Low</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Availability</label>
                      <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value as Availability)}
                        className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm"
                      >
                        <option value="none">None</option>
                        <option value="low">Low</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  {/* CVSS Score Display */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800">
                    <div>
                      <p className="text-sm text-muted-foreground">Calculated CVSS Score</p>
                      <p className="text-3xl font-bold">{calculatedCVSS.toFixed(1)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Severity</p>
                      <Badge className={cn("border", getSeverityColor(getSeverityFromCVSS(calculatedCVSS)))}>
                        {getSeverityFromCVSS(calculatedCVSS).toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Internal Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Internal Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Add internal notes about this report..."
                    className="w-full h-32 p-3 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    These notes are only visible to internal team members
                  </p>
                </CardContent>
              </Card>

              {/* Status Workflow Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Status Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/20">
                      <Archive className="w-4 h-4 mr-2" />
                      Mark Duplicate
                    </Button>
                    <Button variant="outline" className="border-yellow-500/30 hover:bg-yellow-500/20">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Request More Info
                    </Button>
                    <Button variant="outline" className="border-neon-green/30 hover:bg-neon-green/20">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Validate & Escalate
                    </Button>
                    <Button variant="outline" className="border-gray-500/30 hover:bg-gray-500/20">
                      <XCircle className="w-4 h-4 mr-2" />
                      Close as N/A
                    </Button>
                    <Button variant="outline" className="border-neon-teal/30 hover:bg-neon-teal/20">
                      <Shield className="w-4 h-4 mr-2" />
                      Mark Fixed
                    </Button>
                    <Button variant="outline" className="border-blue-500/30 hover:bg-blue-500/20">
                      <Send className="w-4 h-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
