import type { TelemetryState } from '../types/telemetry.ts';

// 1. Nominal / Booming Scenario
export const mockNominalState: TelemetryState = {
  totalHustleRevenueUsd: 1485.50,
  roblox: {
    universeId: '681928401',
    placeName: 'Project Velocity 2026',
    currentCcu: 142,
    dailyVisits: 3840,
    totalVisits: 185420,
    avgVisitDurationSeconds: 645,
    estimatedD1Retention: 22.4,
    robuxRevenueDaily: 4850,
    robuxRevenueMonthly: 132000,
    activeServerCount: 12,
    crashRatePercent: 0.08,
    errorCount: 0,
    recentErrors: []
  },
  webHealth: {
    totalMonitored: 3,
    healthyCount: 3,
    degradedCount: 0,
    downCount: 0,
    avgLatencyMs: 148,
    uptimePercent: 99.94,
    endpoints: [
      {
        url: 'https://my-game-hub.com',
        status: 'HEALTHY',
        statusCode: 200,
        responseTimeMs: 95,
        sslValid: true,
        sslDaysRemaining: 74
      },
      {
        url: 'https://api.my-game-hub.com/health',
        status: 'HEALTHY',
        statusCode: 200,
        responseTimeMs: 128,
        sslValid: true,
        sslDaysRemaining: 74
      },
      {
        url: 'https://stats.my-indie-project.org',
        status: 'HEALTHY',
        statusCode: 200,
        responseTimeMs: 220,
        sslValid: true,
        sslDaysRemaining: 48
      }
    ]
  },
  searchConsole: {
    totalImpressions: 12840,
    totalClicks: 412,
    overallCtr: 3.21,
    queries: [
      {
        query: 'roblox simulator game codes 2026',
        impressions: 4200,
        clicks: 48,
        ctr: 1.14,
        averagePosition: 4.8,
        isGrowthLeak: true,
        recommendedAction: 'Add [WORKING CODES] badge in title tag to lift CTR above 3.5%.'
      },
      {
        query: 'indie productivity micro saas',
        impressions: 1850,
        clicks: 25,
        ctr: 1.35,
        averagePosition: 6.2,
        isGrowthLeak: true,
        recommendedAction: 'Feature free tier callout in meta description snippet.'
      },
      {
        query: 'best speedrun obby tricks roblox',
        impressions: 890,
        clicks: 94,
        ctr: 10.56,
        averagePosition: 2.1,
        isGrowthLeak: false
      },
      {
        query: 'side hustle telemetry discord',
        impressions: 540,
        clicks: 68,
        ctr: 12.59,
        averagePosition: 1.8,
        isGrowthLeak: false
      }
    ],
    growthLeaks: [
      {
        query: 'roblox simulator game codes 2026',
        impressions: 4200,
        clicks: 48,
        ctr: 1.14,
        averagePosition: 4.8,
        isGrowthLeak: true,
        recommendedAction: 'Add [WORKING CODES] badge in title tag to lift CTR above 3.5%.'
      },
      {
        query: 'indie productivity micro saas',
        impressions: 1850,
        clicks: 25,
        ctr: 1.35,
        averagePosition: 6.2,
        isGrowthLeak: true,
        recommendedAction: 'Feature free tier callout in meta description snippet.'
      }
    ]
  },
  growthAudit: {
    executiveSummary: 'Strong user influx with peak CCU at 142. The primary conversion friction resides in search query snippet click-through rates and early tutorial completion in Roblox. Executing the 3 prescribed experiments will capitalize on current momentum.',
    platformStatus: {
      robloxHealth: 'EXCELLENT',
      webHealth: 'EXCELLENT',
      searchVisibility: 'UNDERPERFORMING'
    },
    keyBottlenecks: [
      'Search Snippet CTR: 4.2k impressions leaking clicks on "game codes" query.',
      'Roblox Session Dropoff: 30% drop at Stage 3 tutorial obstacle.',
      'Monetization Conversion: Player session length exceeds 10m but initial gamepass purchase threshold remains untapped.'
    ],
    provider: 'Gemini 1.5 Flash (AI Director)',
    tacticalExperiments: [
      {
        id: 1,
        title: 'Accelerated FTUE & Starter Boost Hook',
        area: 'RETENTION',
        rationale: 'High visit count with player churn before second loop milestone.',
        hypothesis: 'If we compress the starter tutorial from 4 minutes to 90 seconds and award a cosmetic speed coil, Day 1 retention will rise from 22.4% to 26.5%.',
        implementationSteps: [
          'Streamline starter spawn dialog into non-blocking billboard hints.',
          'Inject glowing navigation waypoints to Stage 1 objectives.',
          'Trigger particle celebration and award 100 starter coins.'
        ],
        metricToTrack: 'Day 1 Player Retention Rate',
        targetImprovement: '+4.1% D1 Retention',
        effortEstimate: 'LOW'
      },
      {
        id: 2,
        title: 'Impulse Micro-Gamepass Introduction (49 R$)',
        area: 'MONETIZATION',
        rationale: 'Players average 10.75m per session without converting on premium tier items.',
        hypothesis: 'If we introduce a 49-Robux "Neon Trail & 2x Coin Charm" upon reaching Level 5, conversion rate will double.',
        implementationSteps: [
          'Create 49 R$ Gamepass item in Creator Dashboard.',
          'Hook prompt logic upon Player.LevelChanged event.',
          'Track conversion cohort in Roblox Open Cloud Analytics.'
        ],
        metricToTrack: 'Daily Robux Revenue per Active Player',
        targetImprovement: '+38% Daily Robux Volume',
        effortEstimate: 'LOW'
      },
      {
        id: 3,
        title: 'Search SERP Title & Schema CTR Overhaul',
        area: 'SEO_ACQUISITION',
        rationale: '4,200 impressions on top queries with sub-2.0% CTR.',
        hypothesis: 'If we rewrite the title tags to include "[Updated 2026]" with active verified badges, CTR will surge past 3.5%.',
        implementationSteps: [
          'Rewrite landing page meta title and meta descriptions.',
          'Inject JSON-LD structured data for FAQ and Breadcrumbs.',
          'Request manual re-indexing in Google Search Console.'
        ],
        metricToTrack: 'Organic CTR for Target Keywords',
        targetImprovement: '+2.4% Absolute CTR Lift',
        effortEstimate: 'LOW'
      }
    ]
  }
};

// 2. Outage Scenario: Desk 2 Down
export const mockOutageState: TelemetryState = {
  ...mockNominalState,
  webHealth: {
    ...mockNominalState.webHealth,
    healthyCount: 1,
    downCount: 1,
    degradedCount: 1,
    avgLatencyMs: 2450,
    uptimePercent: 91.2,
    endpoints: [
      {
        url: 'https://my-game-hub.com',
        status: 'DOWN',
        statusCode: 502,
        responseTimeMs: 5012,
        sslValid: true,
        sslDaysRemaining: 74,
        error: '502 Bad Gateway - Connection refused by upstream proxy'
      },
      {
        url: 'https://api.my-game-hub.com/health',
        status: 'DEGRADED',
        statusCode: 200,
        responseTimeMs: 2340,
        sslValid: true,
        sslDaysRemaining: 12,
        error: 'Latency exceeds SLA (2340ms > 2000ms)'
      },
      {
        url: 'https://stats.my-indie-project.org',
        status: 'HEALTHY',
        statusCode: 200,
        responseTimeMs: 180,
        sslValid: true,
        sslDaysRemaining: 48
      }
    ]
  }
};

// 3. Crashing Scenario: Desk 1 Errors
export const mockCrashingState: TelemetryState = {
  ...mockNominalState,
  roblox: {
    ...mockNominalState.roblox,
    crashRatePercent: 4.82,
    errorCount: 17,
    recentErrors: [
      {
        script: 'ServerScriptService.CombatHandler',
        message: 'attempt to index nil with HitboxRaycast',
        count: 11,
        time: '2 mins ago'
      },
      {
        script: 'ReplicatedStorage.Network.Remotes',
        message: 'Server rate limit exceeded on RemoteEvent Invocation',
        count: 6,
        time: '5 mins ago'
      }
    ]
  }
};
