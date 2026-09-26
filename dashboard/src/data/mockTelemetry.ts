import type { TelemetryState } from '../types/telemetry.ts';

// 1. Nominal State with User's Real Platforms:
// Roblox: "Build your AI Datacentre" (Universe 10766029183)
// Web: "https://www.tradeopportunities.trade/#opportunities"
export const mockNominalState: TelemetryState = {
  totalHustleRevenueUsd: 0,
  roblox: {
    universeId: '10766029183',
    placeName: 'Build your AI Datacentre',
    currentCcu: 0,
    dailyVisits: 8,
    totalVisits: 81,
    avgVisitDurationSeconds: 420,
    estimatedD1Retention: 18.5,
    robuxRevenueDaily: 0,
    robuxRevenueMonthly: 0,
    activeServerCount: 0,
    crashRatePercent: 0.0,
    errorCount: 0,
    recentErrors: []
  },
  webHealth: {
    totalMonitored: 1,
    healthyCount: 1,
    degradedCount: 0,
    downCount: 0,
    avgLatencyMs: 273,
    uptimePercent: 100.0,
    endpoints: [
      {
        url: 'https://www.tradeopportunities.trade/#opportunities',
        status: 'HEALTHY',
        statusCode: 200,
        responseTimeMs: 273,
        sslValid: true,
        sslDaysRemaining: 63
      }
    ]
  },
  searchConsole: {
    totalImpressions: 3420,
    totalClicks: 88,
    overallCtr: 2.57,
    queries: [
      {
        query: 'build your ai datacentre roblox codes',
        impressions: 1450,
        clicks: 22,
        ctr: 1.51,
        averagePosition: 3.8,
        isGrowthLeak: true,
        recommendedAction: 'Add [NEW CODES] badge in title tag to lift CTR above 3.5%.'
      },
      {
        query: 'trade opportunities market scanner',
        impressions: 890,
        clicks: 18,
        ctr: 2.02,
        averagePosition: 4.2,
        isGrowthLeak: false,
        recommendedAction: 'Feature live signal preview in meta description snippet.'
      },
      {
        query: 'ai datacenter simulator tycoon tips',
        impressions: 620,
        clicks: 34,
        ctr: 5.48,
        averagePosition: 2.4,
        isGrowthLeak: false
      }
    ],
    growthLeaks: [
      {
        query: 'build your ai datacentre roblox codes',
        impressions: 1450,
        clicks: 22,
        ctr: 1.51,
        averagePosition: 3.8,
        isGrowthLeak: true,
        recommendedAction: 'Add [NEW CODES] badge in title tag to lift CTR above 3.5%.'
      }
    ]
  },
  growthAudit: {
    executiveSummary: 'Telemetric analysis for "Build your AI Datacentre" and "tradeopportunities.trade": Web infrastructure is 100% operational with healthy 273ms latency. Early traction for "Build your AI Datacentre" (81 visits) indicates high leverage in early-game retention loops and organic search title optimization.',
    platformStatus: {
      robloxHealth: 'STABLE',
      webHealth: 'EXCELLENT',
      searchVisibility: 'STABLE'
    },
    keyBottlenecks: [
      'Early Stage Discovery: "Build your AI Datacentre" needs starter onboarding flow to retain initial cohorts.',
      'Search Snippet CTR: 1,450 impressions on game codes query lagging at 1.51% CTR.',
      'Conversion Trigger: Setup starter tycoon milestones to turn casual visitors into repeat players.'
    ],
    provider: 'Side-Hustle Automation Engine',
    tacticalExperiments: [
      {
        id: 1,
        title: 'Starter Tycoon Onboarding & Free Server Rack Boost',
        area: 'RETENTION',
        rationale: '81 initial visits recorded. First 2 minutes of gameplay determine whether players bookmark the experience.',
        hypothesis: 'If new players receive an automated glowing waypoint to their first GPU cluster + 25 starter energy coins, session duration will double.',
        implementationSteps: [
          'Add glowing 3D beam pointing to empty server plot.',
          'Inject instant visual feedback upon placing the first cooling fan.',
          'Trigger achievement badge and in-game particle celebration.'
        ],
        metricToTrack: 'Average Visit Duration (target >8 minutes)',
        targetImprovement: '+45% Session Length',
        effortEstimate: 'LOW'
      },
      {
        id: 2,
        title: 'Meta Title Hook Optimization for Trade Opportunities',
        area: 'SEO_ACQUISITION',
        rationale: 'Search queries for trading signals show steady impressions with room for CTR growth.',
        hypothesis: 'If title tags include active power hooks like "[Live Screener 2026]", click-through rate will exceed 3.5%.',
        implementationSteps: [
          'Update <title> tag on https://www.tradeopportunities.trade/#opportunities.',
          'Add OpenGraph and Twitter card rich preview metadata.',
          'Submit updated URL for indexing in Google Search Console.'
        ],
        metricToTrack: 'Organic CTR on Target Queries',
        targetImprovement: '+1.5% Absolute CTR Lift',
        effortEstimate: 'LOW'
      },
      {
        id: 3,
        title: 'Automated Daily Login Streak & Rebirth Multipliers',
        area: 'RETENTION',
        rationale: 'Encouraging Day 2 return visits establishes the core compounding loop.',
        hypothesis: 'Adding a 7-day progressive server cooling speed multiplier will lift D1 retention above 25%.',
        implementationSteps: [
          'Create DataStore profile saving lastLoginTimestamp.',
          'Display clean popup in lobby showing daily claimable rewards.',
          'Award 1.2x datacenter compute speed on Day 2.'
        ],
        metricToTrack: 'Day 1 Return Player Rate',
        targetImprovement: '+6.5% D1 Retention',
        effortEstimate: 'MEDIUM'
      }
    ]
  }
};

// 2. Outage Scenario: tradeopportunities.trade Down
export const mockOutageState: TelemetryState = {
  ...mockNominalState,
  webHealth: {
    ...mockNominalState.webHealth,
    healthyCount: 0,
    downCount: 1,
    degradedCount: 0,
    avgLatencyMs: 5012,
    uptimePercent: 0.0,
    endpoints: [
      {
        url: 'https://www.tradeopportunities.trade/#opportunities',
        status: 'DOWN',
        statusCode: 502,
        responseTimeMs: 5012,
        sslValid: true,
        sslDaysRemaining: 63,
        error: '502 Bad Gateway - Connection refused by upstream proxy'
      }
    ]
  }
};

// 3. Crashing Scenario: Build your AI Datacentre Runtime Crash
export const mockCrashingState: TelemetryState = {
  ...mockNominalState,
  roblox: {
    ...mockNominalState.roblox,
    crashRatePercent: 3.45,
    errorCount: 8,
    recentErrors: [
      {
        script: 'ServerScriptService.DatacentreGrid',
        message: 'attempt to index nil with ServerRackPower',
        count: 5,
        time: '3 mins ago'
      },
      {
        script: 'ReplicatedStorage.CoolingSystems',
        message: 'ComputeLoad exceeds allocated node buffer',
        count: 3,
        time: '7 mins ago'
      }
    ]
  }
};
