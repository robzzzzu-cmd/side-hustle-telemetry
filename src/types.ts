/**
 * Types & Data Contracts for Side-Hustle Telemetry Engine
 */

export type ExecutionMode = 'audit' | 'health';
export type LLMProvider = 'gemini' | 'openai';

export interface AppConfig {
  discordWebhookUrl: string;
  llmApiKey?: string;
  llmProvider: LLMProvider;
  llmModel: string;
  robloxOpenCloudKey?: string;
  robloxUniverseId?: string;
  monitoredUrls: string[];
  enableMock: boolean;
  searchConsoleEnabled: boolean;
  mode: ExecutionMode;
}

export interface RobloxTelemetry {
  universeId: string;
  placeName: string;
  currentCcu: number;
  dailyVisits: number;
  totalVisits: number;
  avgVisitDurationSeconds: number;
  estimatedD1Retention: number; // e.g. 18.4%
  robuxRevenueDaily: number;
  robuxRevenueMonthly: number;
  activeServerCount: number;
  crashRatePercent: number;
  isMock: boolean;
  collectedAt: string;
}

export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';

export interface WebEndpointHealth {
  url: string;
  status: HealthStatus;
  statusCode: number | null;
  responseTimeMs: number;
  sslValid: boolean | null;
  sslDaysRemaining: number | null;
  sslExpiryDate: string | null;
  error: string | null;
  timestamp: string;
}

export interface WebHealthReport {
  endpoints: WebEndpointHealth[];
  totalMonitored: number;
  healthyCount: number;
  degradedCount: number;
  downCount: number;
  avgLatencyMs: number;
  hasOutages: boolean;
  collectedAt: string;
}

export interface SearchQueryMetric {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number; // Percentage, e.g. 1.8%
  averagePosition: number;
  isGrowthLeak: boolean; // impressions > 300 && ctr < 2.0%
  recommendedAction?: string;
}

export interface SearchConsoleReport {
  totalImpressions: number;
  totalClicks: number;
  overallCtr: number;
  queries: SearchQueryMetric[];
  growthLeaks: SearchQueryMetric[];
  collectedAt: string;
  isMock: boolean;
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
    robloxHealth: 'EXCELLENT' | 'STABLE' | 'NEEDS_ATTENTION' | 'UNAVAILABLE';
    webHealth: 'EXCELLENT' | 'STABLE' | 'DEGRADED' | 'CRITICAL';
    searchVisibility: 'GROWING' | 'STABLE' | 'UNDERPERFORMING';
  };
  keyBottlenecks: string[];
  tacticalExperiments: TacticalExperiment[];
  generatedAt: string;
  provider: 'GEMINI' | 'OPENAI' | 'HEURISTIC_FALLBACK';
}

export interface TelemetryPayload {
  timestamp: string;
  environment: 'production' | 'mock';
  roblox: RobloxTelemetry | null;
  webHealth: WebHealthReport;
  searchConsole: SearchConsoleReport | null;
  errors: Array<{
    source: string;
    message: string;
    timestamp: string;
  }>;
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title: string;
  description?: string;
  url?: string;
  color: number;
  fields?: DiscordEmbedField[];
  author?: {
    name: string;
    icon_url?: string;
    url?: string;
  };
  thumbnail?: {
    url: string;
  };
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
}

export interface DiscordWebhookPayload {
  username?: string;
  avatar_url?: string;
  content?: string;
  embeds: DiscordEmbed[];
}
