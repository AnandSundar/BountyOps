"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIBadge } from "@/components/ui/ai-badge";
import { AILoading } from "@/components/ui/ai-loading";
import { cn } from "@/lib/utils";
import { 
  Copy, 
  Check, 
  Eye, 
  Edit3,
  MessageSquare,
  Send,
  Lightbulb,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Award,
  FileText,
  RefreshCw,
  Sparkles,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Template types
type TemplateType = "duplicate" | "valid" | "needs_info" | "out_of_scope" | "fixed";

// Response templates
const templates: Record<TemplateType, { subject: string; body: string }> = {
  duplicate: {
    subject: "Re: Duplicate Report - [Report Title]",
    body: `Dear researcher,

Thank you for submitting this vulnerability report to our bug bounty program.

After careful investigation, we have determined that this issue has been previously reported by another researcher. Your findings have been noted and will be considered as part of our ongoing security improvements.

We appreciate your effort and time spent on this submission. Please note that duplicate reports are not eligible for bounty rewards, but we encourage you to continue hunting for unique vulnerabilities in our systems.

For your reference, the original report has been linked to this submission.

Thank you for your continued support in making our platform more secure.

Best regards,
Security Team`
  },
  valid: {
    subject: "Re: Valid Vulnerability Confirmed - Bounty Awarded [Report Title]",
    body: `Dear researcher,

We are pleased to inform you that your vulnerability report has been validated and confirmed as a legitimate security finding.

Our security team has assessed the impact and severity of this vulnerability, and we want to thank you for your responsible disclosure. Your findings have helped us improve the security of our platform.

As a token of our appreciation, a bounty of [AMOUNT] has been awarded to you. The bounty will be processed within 14 business days.

What happens next:
- Our development team is working on implementing a fix
- We will notify you once the vulnerability has been remediated
- We would be happy to provide a CVE assignment if applicable

Thank you for your valuable contribution to our security program.

Best regards,
Security Team`
  },
  needs_info: {
    subject: "Re: Additional Information Required - [Report Title]",
    body: `Dear researcher,

Thank you for submitting this vulnerability report. We appreciate the effort you put into identifying this potential security issue.

After initial review, we need some additional information to properly assess and validate this finding:

1. Please provide exact steps to reproduce the vulnerability
2. Can you confirm which version/build you tested against?
3. Are there any specific browser or tool versions you used?
4. Please share any proof-of-concept code or payloads used

Once we receive this information, we will be able to proceed with the validation process.

Please respond within 7 days. If we don't hear back, the report may be closed.

Thank you for your patience and collaboration.

Best regards,
Security Team`
  },
  out_of_scope: {
    subject: "Re: Out of Scope - [Report Title]",
    body: `Dear researcher,

Thank you for submitting this report to our bug bounty program.

After careful review, we have determined that this finding falls outside the scope of our bug bounty program. Our program scope includes:

In-Scope:
- Web application vulnerabilities
- API security issues
- Authentication and authorization flaws
- Data exposure vulnerabilities

Out of Scope:
- Social engineering attacks
- Physical security vulnerabilities
- Issues requiring physical access
- Vulnerabilities in third-party services
- Denial of service attacks

Please note that out of scope findings are not eligible for bounty rewards. However, we appreciate you taking the time to report them.

For more information about our program scope, please visit: [PROGRAM_URL]

Thank you for understanding.

Best regards,
Security Team`
  },
  fixed: {
    subject: "Re: Vulnerability Remediated - [Report Title]",
    body: `Dear researcher,

We wanted to update you on the status of your vulnerability report.

Good news! The vulnerability you reported has been successfully fixed and deployed to production. Our team has implemented the following remediation:

- [Describe the fix implemented]
- [Additional security measures added]

We would like to thank you again for bringing this issue to our attention. Your responsible disclosure has helped make our platform more secure for all users.

If you would like to verify the fix, please feel free to test the affected endpoint. If you find any remaining issues or have new findings, please don't hesitate to submit a new report.

Thank you for your continued support of our security program.

Best regards,
Security Team`
  }
};

// Tone guide tips
const toneGuide = {
  professional: [
    "Use formal language and proper grammar",
    "Address researchers respectfully by name when possible",
    "Express gratitude for their contribution",
    "Be clear and concise in your communications"
  ],
  supportive: [
    "Acknowledge the time and effort researchers put in",
    "Provide constructive feedback when possible",
    "Offer guidance on future submissions",
    "Celebrate valid findings enthusiastically"
  ],
  clear: [
    "Use simple, easy-to-understand language",
    "Avoid technical jargon when explaining decisions",
    "Provide specific next steps and timelines",
    "Include relevant links and resources"
  ],
  timely: [
    "Respond within promised timeframes",
    "Provide status updates for ongoing issues",
    "Set clear expectations for resolution times",
    "Follow up promptly on researcher questions"
  ]
};

export default function RespondPage() {
  const [templateType, setTemplateType] = useState<TemplateType>("valid");
  const [subject, setSubject] = useState(templates.valid.subject);
  const [body, setBody] = useState(templates.valid.body);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTip, setActiveTip] = useState<keyof typeof toneGuide>("professional");
  
  // AI Response Generation State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGenerated, setAIGenerated] = useState(false);
  
  // Mock selected report
  const selectedReport = {
    title: "SQL Injection in User Search Endpoint",
    type: "SQL Injection",
    severity: "critical",
    researcher: "security_hunter_42",
    bounty: 5000
  };

  // AI Generate Response Handler
  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    setAIGenerated(false);
    
    try {
      const response = await fetch("/api/agents/draft-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportTitle: selectedReport.title,
          vulnClass: selectedReport.type,
          severity: selectedReport.severity,
          disposition: templateType === "needs_info" ? "needs_more_info" : templateType === "out_of_scope" ? "out_of_scope" : templateType === "fixed" ? "fixed" : templateType === "duplicate" ? "duplicate" : "valid_bounty",
          researcherHandle: selectedReport.researcher,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let generatedText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          generatedText += chunk;
          setBody(generatedText);
        }
      }
      
      setAIGenerated(true);
    } catch (error) {
      console.error("AI generation error:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleTemplateChange = (type: TemplateType) => {
    setTemplateType(type);
    setSubject(templates[type].subject);
    setBody(templates[type].body);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    const fullResponse = `Subject: ${subject}\n\n${body}`;
    await navigator.clipboard.writeText(fullResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTemplateIcon = (type: TemplateType) => {
    switch (type) {
      case "duplicate": return FileText;
      case "valid": return Award;
      case "needs_info": return Clock;
      case "out_of_scope": return XCircle;
      case "fixed": return CheckCircle;
    }
  };

  const getTemplateColor = (type: TemplateType) => {
    switch (type) {
      case "duplicate": return "text-purple-400 bg-purple-500/20 border-purple-500/30";
      case "valid": return "text-neon-green bg-neon-green/20 border-neon-green/30";
      case "needs_info": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "out_of_scope": return "text-gray-400 bg-gray-500/20 border-gray-500/30";
      case "fixed": return "text-neon-teal bg-neon-teal/20 border-neon-teal/30";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Response Center</h1>
          <p className="text-muted-foreground mt-1">
            Craft professional responses to vulnerability reports
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Select Response Template
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
                >
                  {isGeneratingAI ? (
                    <Sparkles className="w-4 h-4 animate-pulse mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Generate with AI
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(templates).map(([type, _]) => {
                  const TemplateIcon = getTemplateIcon(type as TemplateType);
                  return (
                    <button
                      key={type}
                      onClick={() => handleTemplateChange(type as TemplateType)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200",
                        templateType === type 
                          ? "border-neon-green bg-neon-green/10" 
                          : "border-border hover:border-primary/50 hover:bg-white/5"
                      )}
                    >
                      <TemplateIcon className={cn("w-5 h-5", templateType === type ? "text-neon-green" : "text-muted-foreground")} />
                      <span className="text-xs font-medium">
                        {type === "needs_info" ? "Needs Info" : type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Response Editor */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {showPreview ? <Eye className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                {showPreview ? "Preview" : "Edit Response"}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={showPreview ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant={!showPreview ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                {showPreview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-lg bg-slate-800 border border-border"
                  >
                    <div className="mb-4 pb-4 border-b border-border">
                      <p className="text-sm text-muted-foreground mb-1">Subject:</p>
                      <p className="font-medium">{subject}</p>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                      {body.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line || <br />}</p>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Subject</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Response Body</label>
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full h-80 p-4 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateChange(templateType)}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Template
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={copyToClipboard}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Response
                      </>
                    )}
                  </Button>
                  <Button className="gap-2">
                    <Send className="w-4 h-4" />
                    Send Response
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tone Guide Sidebar */}
        <div className="space-y-6">
          {/* Template Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Selected Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg border",
                getTemplateColor(templateType)
              )}>
                {(() => {
                  const Icon = getTemplateIcon(templateType);
                  return <Icon className="w-5 h-5" />;
                })()}
                <div>
                  <p className="font-medium">
                    {templateType === "needs_info" ? "Needs More Info" : templateType.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {templateType === "duplicate" && "Report already exists"}
                    {templateType === "valid" && "Valid vulnerability confirmed"}
                    {templateType === "needs_info" && "Require additional details"}
                    {templateType === "out_of_scope" && "Outside program scope"}
                    {templateType === "fixed" && "Issue has been resolved"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tone Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Tone Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tone Tabs */}
              <div className="flex flex-wrap gap-2">
                {(Object.keys(toneGuide) as Array<keyof typeof toneGuide>).map((tone) => (
                  <Button
                    key={tone}
                    variant={activeTip === tone ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => setActiveTip(tone)}
                  >
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Tips */}
              <div className="space-y-2">
                {toneGuide[activeTip].map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <Target className="w-4 h-4 text-neon-green mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Word Count</span>
                <span className="font-medium">{body.split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Character Count</span>
                <span className="font-medium">{body.length} chars</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estimated Read Time</span>
                <span className="font-medium">{Math.ceil(body.split(/\s+/).filter(Boolean).length / 200)} min</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
