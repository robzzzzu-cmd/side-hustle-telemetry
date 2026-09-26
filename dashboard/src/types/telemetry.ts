export type WorkerId = 'roblox_dev' | 'web_admin' | 'seo_specialist' | 'ai_director';

export interface RobloxTelemetry {
  universeId: string;
  placeName: string;
  currentCcu: number;
  dailyVisits: number;
  totalVisits: number;
  avgVisitDurationSeconds: number;
  estimatedD1Retention: number;
  robuxRevenueDaily: number;
  robuxRevenueMonthly: number;
  activeServerCount: number;
  crashRatePercent: number;
  errorCount: number;
  recentErrors: Array<{
    script: string;
    message: string;
    count: number;
    time: string;
  }>;
}

export interface WebEndpointHealth {
  url: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  statusCode: number;
  responseTimeMs: number;
  sslValid: boolean;
  sslDaysRemaining: number;
  error?: string;
}

export interface WebHealthReport {
  endpoints: WebEndpointHealth[];
  totalMonitored: number;
  healthyCount: number;
  degradedCount: number;
  downCount: number;
  avgLatencyMs: number;
  uptimePercent: number;
}

export interface SearchQueryMetric {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
  isGrowthLeak: boolean;
  recommendedAction?: string;
}

export interface SearchConsoleReport {
  totalImpressions: number;
  totalClicks: number;
  overallCtr: number;
  queries: SearchQueryMetric[];
  growthLeaks: SearchQueryMetric[];
}

export interface TacticalExperiment {
  id: number;
  title: string;
  area: 'RETENTION' | 'MONETIZATION' | 'SEO_ACQUISITION' | 'PERFORMANCE';
  rationale: string;
  hypothesis: string;
  implementationSteps: string[];
  metricToTrack: string;
  targetImprovement: string;
  effortEstimate: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface GrowthAuditReport {
  executiveSummary: string;
  platformStatus: {
    robloxHealth: 'EXCELLENT' | 'STABLE' | 'NEEDS_ATTENTION';
    webHealth: 'EXCELLENT' | 'STABLE' | 'DEGRADED' | 'CRITICAL';
    searchVisibility: 'GROWING' | 'STABLE' | 'UNDERPERFORMING';
  };
  keyBottlenecks: string[];
  tacticalExperiments: TacticalExperiment[];
  provider: string;
}

export interface TelemetryState {
  roblox: RobloxTelemetry;
  webHealth: WebHealthReport;
  searchConsole: SearchConsoleReport;
  growthAudit: GrowthAuditReport;
  totalHustleRevenueUsd: number;
}
