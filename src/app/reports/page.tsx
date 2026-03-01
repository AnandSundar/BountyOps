"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
  Eye,
  Calendar,
  X
} from "lucide-react";
import { mockReports } from "@/data/mock-data";
import { Severity, Status, VulnerabilityReport, VulnerabilityType } from "@/types";
import { ReportDetail } from "@/components/reports/report-detail";
import { motion, AnimatePresence } from "framer-motion";

const severityOptions = ["all", "critical", "high", "medium", "low", "informational"];
const statusOptions = ["all", "open", "in_progress", "resolved", "closed"];
const vulnerabilityTypes = [
  "all",
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
  "Insecure Deserialization"
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vulnTypeFilter, setVulnTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"date" | "severity" | "bounty">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Date range filter
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ 
    start: "", 
    end: "" 
  });
  const [showDateFilter, setShowDateFilter] = useState(false);
  
  // Slide-over state
  const [selectedReport, setSelectedReport] = useState<VulnerabilityReport | null>(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  const filteredReports = useMemo(() => {
    return mockReports
      .filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.researcher.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSeverity = severityFilter === "all" || report.severity === severityFilter;
        const matchesStatus = statusFilter === "all" || report.status === statusFilter;
        const matchesVulnType = vulnTypeFilter === "all" || report.type === vulnTypeFilter;
        
        // Date range filter
        let matchesDate = true;
        if (dateRange.start) {
          matchesDate = matchesDate && new Date(report.createdAt) >= new Date(dateRange.start);
        }
        if (dateRange.end) {
          matchesDate = matchesDate && new Date(report.createdAt) <= new Date(dateRange.end);
        }
        
        return matchesSearch && matchesSeverity && matchesStatus && matchesVulnType && matchesDate;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === "date") {
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === "severity") {
          const severityOrder = { critical: 5, high: 4, medium: 3, low: 2, informational: 1 };
          comparison = severityOrder[b.severity] - severityOrder[a.severity];
        } else if (sortBy === "bounty") {
          comparison = b.bounty - a.bounty;
        }
        return sortOrder === "desc" ? comparison : -comparison;
      });
  }, [searchQuery, severityFilter, statusFilter, vulnTypeFilter, dateRange, sortBy, sortOrder]);

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

  const openReportDetail = (report: VulnerabilityReport) => {
    setSelectedReport(report);
    setIsSlideOverOpen(true);
  };

  const clearDateFilter = () => {
    setDateRange({ start: "", end: "" });
    setShowDateFilter(false);
  };

  const hasActiveFilters = severityFilter !== "all" || statusFilter !== "all" || vulnTypeFilter !== "all" || dateRange.start || dateRange.end;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Report Queue</h1>
          <p className="text-muted-foreground mt-1">
            Manage and triage vulnerability reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="glass" className="text-sm">
            {filteredReports.length} Reports
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Vulnerability Type Filter */}
            <div className="relative">
              <select
                value={vulnTypeFilter}
                onChange={(e) => setVulnTypeFilter(e.target.value)}
                className="h-10 pl-4 pr-10 bg-background border border-border rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {vulnerabilityTypes.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All Vuln Types" : option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Severity Filter */}
            <div className="relative">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="h-10 pl-4 pr-10 bg-background border border-border rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {severityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All Severities" : option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 pl-4 pr-10 bg-background border border-border rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All Statuses" : formatStatus(option)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Date Range Filter */}
            <div className="relative">
              <Button
                variant={showDateFilter || dateRange.start || dateRange.end ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDateFilter(!showDateFilter)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSortBy(sortBy === "date" ? "severity" : sortBy === "severity" ? "bounty" : "date");
                }}
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                {sortBy === "date" ? "Date" : sortBy === "severity" ? "Severity" : "Bounty"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              >
                <ChevronDown className={cn("w-4 h-4 transition-transform", sortOrder === "asc" && "rotate-180")} />
              </Button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center border border-border rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Date Range Inputs */}
          <AnimatePresence>
            {showDateFilter && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex items-center gap-4 mt-4 pt-4 border-t border-border"
              >
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">From:</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="h-9 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">To:</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="h-9 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                {(dateRange.start || dateRange.end) && (
                  <Button variant="ghost" size="sm" onClick={clearDateFilter}>
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {vulnTypeFilter !== "all" && (
                <Badge variant="outline" className="gap-1">
                  Type: {vulnTypeFilter}
                  <button onClick={() => setVulnTypeFilter("all")}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {severityFilter !== "all" && (
                <Badge variant="outline" className="gap-1">
                  Severity: {severityFilter}
                  <button onClick={() => setSeverityFilter("all")}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="outline" className="gap-1">
                  Status: {formatStatus(statusFilter)}
                  <button onClick={() => setStatusFilter("all")}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {(dateRange.start || dateRange.end) && (
                <Badge variant="outline" className="gap-1">
                  Date: {dateRange.start || "..."} to {dateRange.end || "..."}
                  <button onClick={clearDateFilter}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reports List/Grid */}
      {viewMode === "list" ? (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-4">Report</div>
                <div className="col-span-2">Target</div>
                <div className="col-span-1">Severity</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Bounty</div>
                <div className="col-span-2">Researcher</div>
                <div className="col-span-1">Date</div>
              </div>

              {/* Table Rows */}
              {filteredReports.map((report) => (
                <motion.div 
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => openReportDetail(report)}
                >
                  <div className="col-span-4">
                    <p className="font-medium truncate">{report.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{report.type}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm truncate">{report.target}</p>
                  </div>
                  <div className="col-span-1">
                    <Badge className={cn("border", getSeverityColor(report.severity))}>
                      {report.severity}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    <Badge variant="glass" className={cn("border", getStatusColor(report.status))}>
                      {formatStatus(report.status)}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm font-medium">{formatCurrency(report.bounty)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-muted-foreground">{report.researcher}</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm text-muted-foreground">{formatDate(report.createdAt)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card 
                className="hover:shadow-glow transition-all duration-300 cursor-pointer"
                onClick={() => openReportDetail(report)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={cn("border", getSeverityColor(report.severity))}>
                      {report.severity}
                    </Badge>
                    <Badge variant="glass" className={cn("border", getStatusColor(report.status))}>
                      {formatStatus(report.status)}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1 line-clamp-2">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{report.type}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{report.target}</span>
                    <span className="font-medium text-neon-green">{formatCurrency(report.bounty)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">{report.researcher}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(report.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Filter className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reports found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Report Detail Slide-over */}
      <ReportDetail 
        report={selectedReport}
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
      />
    </div>
  );
}
