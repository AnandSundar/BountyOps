"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { 
  Search, 
  Trophy,
  TrendingUp,
  MessageSquare,
  DollarSign,
  Shield
} from "lucide-react";
import { mockReports } from "@/data/mock-data";

// Calculate researcher stats from mock data
const researcherStats = mockReports.reduce((acc, report) => {
  if (!acc[report.researcher]) {
    acc[report.researcher] = {
      name: report.researcher,
      reports: 0,
      totalBounty: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
  }
  acc[report.researcher].reports += 1;
  acc[report.researcher].totalBounty += report.bounty;
  if (report.severity === "critical") acc[report.researcher].critical += 1;
  if (report.severity === "high") acc[report.researcher].high += 1;
  if (report.severity === "medium") acc[report.researcher].medium += 1;
  if (report.severity === "low") acc[report.researcher].low += 1;
  return acc;
}, {} as Record<string, { name: string; reports: number; totalBounty: number; critical: number; high: number; medium: number; low: number }>);

const researchers = Object.values(researcherStats)
  .sort((a, b) => b.totalBounty - a.totalBounty)
  .map((r, index) => ({ ...r, rank: index + 1 }));

export default function ResearchersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Researcher Leaderboard</h1>
          <p className="text-muted-foreground mt-1">
            Top security researchers contributing to our program
          </p>
        </div>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {researchers.slice(0, 3).map((researcher, index) => (
          <Card 
            key={researcher.name}
            className={cn(
              "hover:shadow-glow transition-all duration-300",
              index === 0 && "border-yellow-500/30 bg-yellow-500/5"
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold",
                  index === 0 && "bg-yellow-500/20 text-yellow-400",
                  index === 1 && "bg-gray-400/20 text-gray-300",
                  index === 2 && "bg-orange-600/20 text-orange-400"
                )}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold">{researcher.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {researcher.reports} reports submitted
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-xl font-bold text-neon-green">
                    {formatCurrency(researcher.totalBounty)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Critical Finds</p>
                  <p className="text-xl font-bold text-red-400">
                    {researcher.critical}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* All Researchers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Researchers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-1">Rank</div>
              <div className="col-span-3">Researcher</div>
              <div className="col-span-2">Reports</div>
              <div className="col-span-2">Total Bounty</div>
              <div className="col-span-4">Vulnerability Breakdown</div>
            </div>

            {researchers.map((researcher) => (
              <div 
                key={researcher.name}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors"
              >
                <div className="col-span-1">
                  <span className={cn(
                    "font-bold",
                    researcher.rank <= 3 && "text-yellow-400"
                  )}>
                    #{researcher.rank}
                  </span>
                </div>
                <div className="col-span-3 font-medium">{researcher.name}</div>
                <div className="col-span-2">{researcher.reports}</div>
                <div className="col-span-2">
                  <span className="font-semibold text-neon-green">
                    {formatCurrency(researcher.totalBounty)}
                  </span>
                </div>
                <div className="col-span-4 flex items-center gap-2">
                  {researcher.critical > 0 && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      {researcher.critical} C
                    </Badge>
                  )}
                  {researcher.high > 0 && (
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      {researcher.high} H
                    </Badge>
                  )}
                  {researcher.medium > 0 && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      {researcher.medium} M
                    </Badge>
                  )}
                  {researcher.low > 0 && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {researcher.low} L
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
