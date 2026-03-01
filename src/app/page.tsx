"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIChatPanel } from "@/components/ui/ai-chat-panel";
import { cn, formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Clock,
  TrendingUp,
  ArrowRight,
  Activity,
  Target,
  Zap,
  TargetIcon,
  FileCheck,
  CheckSquare,
  XCircle,
  Clock3,
  MessageSquare,
  Upload,
  Award,
  MessageCircle,
  Bot,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  mockDashboardStats, 
  mockSeverityDistribution, 
  mockStatusDistribution,
  mockMonthlyTrends,
  mockReports 
} from "@/data/mock-data";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from "recharts";

// Calculate SLO Compliance and Reports Closed This Week
const calculateSLOCompliance = () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const resolvedLastWeek = mockReports.filter(r => {
    const updatedDate = new Date(r.updatedAt);
    return r.status === 'resolved' || r.status === 'closed';
  });
  
  // Simulated SLO - 95% compliance target
  return 94.7;
};

const calculateReportsClosedThisWeek = () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return mockReports.filter(r => {
    const updatedDate = new Date(r.updatedAt);
    return (r.status === 'resolved' || r.status === 'closed') && updatedDate >= oneWeekAgo;
  }).length;
};

// Vulnerability class distribution for donut chart
const vulnerabilityClassDistribution = [
  { name: "IDOR", value: 5, color: "#EF4444" },
  { name: "XSS", value: 7, color: "#F97316" },
  { name: "SSRF", value: 3, color: "#EAB308" },
  { name: "CSRF", value: 2, color: "#22C55E" },
  { name: "Auth", value: 4, color: "#06B6D4" },
  { name: "Injection", value: 6, color: "#8B5CF6" },
  { name: "Other", value: 3, color: "#64748B" }
];

// Severity breakdown for bar chart
const severityBreakdownData = [
  { name: "Critical", value: mockDashboardStats.criticalVulnerabilities, color: "#EF4444" },
  { name: "High", value: mockDashboardStats.highVulnerabilities, color: "#F97316" },
  { name: "Medium", value: mockDashboardStats.mediumVulnerabilities, color: "#EAB308" },
  { name: "Low", value: mockDashboardStats.lowVulnerabilities, color: "#3B82F6" },
  { name: "Info", value: mockDashboardStats.informationalVulnerabilities, color: "#64748B" }
];

// Recent activity feed data
const recentActivity = [
  { id: 1, type: "status_change", report: "SQL Injection in User Search", oldStatus: "Open", newStatus: "In Progress", researcher: "security_hunter_42", timestamp: "2026-03-01T14:30:00Z" },
  { id: 2, type: "status_change", report: "Stored XSS in Profile Bio", oldStatus: "In Progress", newStatus: "Resolved", researcher: "xss_master", timestamp: "2026-03-01T12:15:00Z" },
  { id: 3, type: "comment", report: "IDOR in Documents", researcher: "bug_bounty_ninja", timestamp: "2026-03-01T11:45:00Z" },
  { id: 4, type: "status_change", report: "SSRF in Image Upload", oldStatus: "Open", newStatus: "In Progress", researcher: "cloud_security_expert", timestamp: "2026-03-01T10:20:00Z" },
  { id: 5, type: "bounty", report: "Broken Authentication", bounty: "$4,000", researcher: "auth_hacker", timestamp: "2026-02-28T16:00:00Z" },
  { id: 6, type: "status_change", report: "Information Disclosure", oldStatus: "Open", newStatus: "Closed", researcher: "error_hunter", timestamp: "2026-02-28T14:30:00Z" },
  { id: 7, type: "new_report", report: "CSRF Token Missing", researcher: "csrf_expert", timestamp: "2026-02-28T11:00:00Z" },
  { id: 8, type: "status_change", report: "Path Traversal", oldStatus: "Open", newStatus: "Duplicate", researcher: "file_exploiter", timestamp: "2026-02-27T09:30:00Z" },
  { id: 9, type: "comment", report: "XXE Vulnerability", researcher: "xml_attacker", timestamp: "2026-02-26T15:45:00Z" },
  { id: 10, type: "status_change", report: "RCE via Deserialization", oldStatus: "In Progress", newStatus: "Resolved", researcher: "rce_expert", timestamp: "2026-02-25T10:00:00Z" }
];

const statCards = [
  {
    title: "Total Reports",
    value: mockDashboardStats.totalReports,
    icon: Shield,
    color: "text-neon-green",
    bgColor: "bg-neon-green/10",
    trend: "+12%",
    trendUp: true
  },
  {
    title: "SLO Compliance",
    value: `${calculateSLOCompliance()}%`,
    icon: TargetIcon,
    color: "text-neon-teal",
    bgColor: "bg-neon-teal/10",
    trend: "+2%",
    trendUp: true
  },
  {
    title: "Resolved",
    value: mockDashboardStats.resolvedReports,
    icon: CheckCircle,
    color: "text-neon-teal",
    bgColor: "bg-neon-teal/10",
    trend: "+18%",
    trendUp: true
  },
  {
    title: "Reports Closed This Week",
    value: calculateReportsClosedThisWeek(),
    icon: FileCheck,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    trend: "+5",
    trendUp: true
  },
  {
    title: "Total Bounties",
    value: formatCurrency(mockDashboardStats.totalBountyPaid),
    icon: DollarSign,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    trend: "+24%",
    trendUp: true
  },
  {
    title: "Critical Vulns",
    value: mockDashboardStats.criticalVulnerabilities,
    icon: Zap,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    trend: "+3",
    trendUp: false
  }
];

const recentReports = mockReports.slice(0, 5);

export default function Dashboard() {
  const [activityFilter, setActivityFilter] = useState("all");
  const [isIntelOpen, setIsIntelOpen] = useState(false);
  const [intelMessages, setIntelMessages] = useState<Array<{id: string, role: "user" | "assistant", content: string, timestamp: Date}>>([]);
  const [intelInput, setIntelInput] = useState("");
  const [intelLoading, setIntelLoading] = useState(false);

  const filteredActivity = useMemo(() => {
    if (activityFilter === "all") return recentActivity;
    return recentActivity.filter(a => a.type === activityFilter);
  }, [activityFilter]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "status_change": return Clock3;
      case "comment": return MessageSquare;
      case "bounty": return Award;
      case "new_report": return Upload;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "status_change": return "text-neon-teal bg-neon-teal/10";
      case "comment": return "text-blue-400 bg-blue-400/10";
      case "bounty": return "text-neon-green bg-neon-green/10";
      case "new_report": return "text-purple-400 bg-purple-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your bug bounty program performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Live Feed
          </Button>
          <Link href="/reports">
            <Button size="sm">
              View All Reports
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-glow transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div className={cn(
                    "text-xs font-medium flex items-center gap-1",
                    stat.trendUp ? "text-neon-green" : "text-red-500"
                  )}>
                    <TrendingUp className={cn("w-3 h-3", !stat.trendUp && "rotate-180")} />
                    {stat.trend}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vulnerability Class Distribution - Donut Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Vulnerability Class</CardTitle>
            <Badge variant="glass">Distribution</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vulnerabilityClassDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {vulnerabilityClassDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {vulnerabilityClassDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Severity Breakdown - Bar Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Severity Breakdown</CardTitle>
            <Badge variant="glass">By CVSS</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityBreakdownData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={60} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {severityBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Monthly Trends</CardTitle>
            <Badge variant="glass">Last 3 months</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockMonthlyTrends}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="reports" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorReports)" 
                    name="Reports"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#06B6D4" 
                    fillOpacity={1} 
                    fill="url(#colorResolved)" 
                    name="Resolved"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed and Recent Reports Row */}
      <div className="-1 lg:grid-cols-grid grid-cols3 gap-6">
        {/* Recent Activity Feed Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <div className="flex gap-1">
              <Button 
                variant={activityFilter === "all" ? "default" : "ghost"} 
                size="sm"
                className="h-7 text-xs"
                onClick={() => setActivityFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={activityFilter === "status_change" ? "default" : "ghost"} 
                size="sm"
                className="h-7 text-xs"
                onClick={() => setActivityFilter("status_change")}
              >
                Status
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              <AnimatePresence>
                {filteredActivity.slice(0, 10).map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className={cn("p-1.5 rounded-lg", getActivityColor(activity.type))}>
                        <ActivityIcon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.report}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          {activity.type === "status_change" && (
                            <span>{activity.oldStatus} → <span className="text-neon-teal">{activity.newStatus}</span></span>
                          )}
                          {activity.type === "bounty" && (
                            <span className="text-neon-green font-medium">{activity.bounty}</span>
                          )}
                          {activity.type === "new_report" && (
                            <span>New report submitted</span>
                          )}
                          {activity.type === "comment" && (
                            <span>New comment added</span>
                          )}
                          <span>•</span>
                          <span>{activity.researcher}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(activity.timestamp)}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Reports</CardTitle>
            <Link href="/reports">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <Link 
                  key={report.id} 
                  href={`/reports/${report.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className={cn(
                    "w-1 h-12 rounded-full",
                    report.severity === "critical" && "bg-red-500",
                    report.severity === "high" && "bg-orange-500",
                    report.severity === "medium" && "bg-yellow-500",
                    report.severity === "low" && "bg-blue-500",
                    report.severity === "informational" && "bg-gray-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{report.title}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Target className="w-3 h-3" />
                      {report.target}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={cn(
                      report.severity === "critical" && "bg-red-500/20 text-red-400 border-red-500/30",
                      report.severity === "high" && "bg-orange-500/20 text-orange-400 border-orange-500/30",
                      report.severity === "medium" && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                      report.severity === "low" && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                      report.severity === "informational" && "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    )}>
                      {report.severity}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(report.bounty)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Ask Intel Button */}
      <motion.button
        onClick={() => setIsIntelOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-full shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-200"></span>
        </span>
        <Bot className="w-5 h-5" />
        <span className="font-medium">Ask Intel</span>
      </motion.button>

      {/* Intel Chat Panel */}
      <AIChatPanel
        isOpen={isIntelOpen}
        onClose={() => setIsIntelOpen(false)}
        title="Program Intelligence"
        messages={intelMessages.map((m: any) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          timestamp: new Date()
        }))}
        onSendMessage={async (msg: string) => {
          // Add user message
          setIntelMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: msg, timestamp: new Date() }]);
          setIntelLoading(true);
          
          try {
            const response = await fetch("/api/agents/intel", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                messages: [...intelMessages.map(m => ({ role: m.role, content: m.content })), { role: "user", content: msg }]
              })
            });
            
            if (!response.ok) {
              throw new Error(`API error: ${response.status}`);
            }
            
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = "";
            const assistantId = Date.now().toString();
            
            if (reader) {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value, { stream: true });
                assistantMessage += text;
                // Update messages in real-time
                setIntelMessages(prev => {
                  const existing = prev.find(m => m.role === "assistant" && m.id === assistantId);
                  if (existing) {
                    return prev.map(m => m.id === assistantId ? { ...m, content: assistantMessage } : m);
                  }
                  return [...prev, { id: assistantId, role: "assistant", content: assistantMessage, timestamp: new Date() }];
                });
              }
            }
          } catch (error) {
            console.error("Failed to send message:", error);
            setIntelMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "Sorry, I encountered an error. Please check that your OPENAI_API_KEY is set in .env.local", timestamp: new Date() }]);
          } finally {
            setIntelLoading(false);
          }
        }}
        isLoading={intelLoading}
        suggestions={[
          "What's our SLO trend?",
          "Which vuln class has most backlog?",
          "Who are our top researchers?",
          "Where should I focus triage today?"
        ]}
      />
    </div>
  );
}
