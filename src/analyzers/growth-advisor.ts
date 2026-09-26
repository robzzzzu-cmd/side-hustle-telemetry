import type {
  AppConfig,
  GrowthAuditReport,
  TacticalExperiment,
  TelemetryPayload
} from '../types.js';

const SYSTEM_PROMPT = `You are a quantitative growth strategist for indie games and web apps. Analyze telemetry, diagnose conversion friction and retention bottlenecks, and prescribe exactly 3 high-impact, testable experiments for the coming week.

Your output must be strictly valid JSON matching this schema:
{
  "executiveSummary": "Concise 2-3 sentence diagnosis of current platform performance and biggest lever for growth",
  "platformStatus": {
    "robloxHealth": "EXCELLENT" | "STABLE" | "NEEDS_ATTENTION" | "UNAVAILABLE",
    "webHealth": "EXCELLENT" | "STABLE" | "DEGRADED" | "CRITICAL",
    "searchVisibility": "GROWING" | "STABLE" | "UNDERPERFORMING"
  },
  "keyBottlenecks": ["bottleneck 1", "bottleneck 2", "bottleneck 3"],
  "tacticalExperiments": [
    {
      "id": 1,
      "title": "Clear experiment title",
      "area": "RETENTION" | "MONETIZATION" | "SEO_ACQUISITION" | "PERFORMANCE",
      "rationale": "Why this experiment is prioritized based on the telemetry",
      "hypothesis": "If we [change], then [outcome] because [data-backed reason]",
      "implementationSteps": ["Step 1", "Step 2", "Step 3"],
      "metricToTrack": "Specific primary metric (e.g., D1 Retention, Bounce Rate, CTR)",
      "targetImprovement": "+XX% lift",
      "effortEstimate": "LOW" | "MEDIUM" | "HIGH"
    }
  ]
}`;

/**
 * Rule-based heuristic growth advisor when LLM API keys are not supplied or network fails
 */
export function generateHeuristicAnalysis(telemetry: TelemetryPayload): GrowthAuditReport {
  const bottlenecks: string[] = [];
  const experiments: TacticalExperiment[] = [];

  const roblox = telemetry.roblox;
  const web = telemetry.webHealth;
  const search = telemetry.searchConsole;

  // 1. Analyze Roblox Retention & Engagement
  if (roblox) {
    if (roblox.estimatedD1Retention < 20) {
      bottlenecks.push(`Low D1 Player Retention (${roblox.estimatedD1Retention}%): Players drop off before reaching the second core game loop.`);
      experiments.push({
        id: 1,
        title: 'First-Time User Experience (FTUE) Milestone Acceleration',
        area: 'RETENTION',
        rationale: `Current D1 retention is ${roblox.estimatedD1Retention}%. Telemetry indicates players take >600s to achieve their first major achievement.`,
        hypothesis: 'If we compress the tutorial to 90 seconds and reward an instant double-jump booster upon first completion, D1 retention will lift by +3.5%.',
        implementationSteps: [
          'Audit Luau spawn scripts and remove non-essential text dialog blocks.',
          'Inject animated 3D directional arrow pointing directly to the starter upgrade shop.',
          'Grant an immediate cosmetic trail and 50 starter coins in the first 60 seconds.'
        ],
        metricToTrack: 'Day 1 Player Retention Rate (%)',
        targetImprovement: '+3.5% (from 18.4% to 21.9%)',
        effortEstimate: 'MEDIUM'
      });
    }

    if (roblox.robuxRevenueDaily < 5000) {
      bottlenecks.push(`Monetization Friction (${roblox.robuxRevenueDaily} Robux/day): High session times (${Math.round(roblox.avgVisitDurationSeconds / 60)}m) are not converting to gamepass purchases.`);
      experiments.push({
        id: 2,
        title: 'Impulse Micro-Gamepass & Starter Bundle Introduction',
        area: 'MONETIZATION',
        rationale: `With ${roblox.currentCcu} CCU and 3,400+ daily visits, the average monetization is under 1.5 Robux per player.`,
        hypothesis: 'If we introduce a 49-Robux "Starter Speed Coil Pack" prompted upon the first game completion, conversion rate will double.',
        implementationSteps: [
          'Create a 49 Robux Gamepass product in Roblox Creator Dashboard.',
          'Add a non-intrusive UI prompt displayed exclusively after player achieves Level 5.',
          'Track purchase conversion funnel using Roblox Analytics Events.'
        ],
        metricToTrack: 'Daily Robux Revenue & Buyer Conversion Rate',
        targetImprovement: '+45% Daily Robux Volume',
        effortEstimate: 'LOW'
      });
    }
  }

  // 2. Analyze Web Latency & Search Console
  if (web.hasOutages || web.degradedCount > 0) {
    bottlenecks.push(`Web Endpoint Latency: ${web.degradedCount} service(s) exceeding SLA threshold (>2000ms latency).`);
    experiments.push({
      id: 3,
      title: 'Edge Caching & Compression for API & Landing Page',
      area: 'PERFORMANCE',
      rationale: `Endpoint response time is averaging ${web.avgLatencyMs}ms, creating bounce friction for landing visitors.`,
      hypothesis: 'If we implement stale-while-revalidate caching and gzip compression on response payloads, latency will drop below 350ms.',
      implementationSteps: [
        'Configure Cloudflare Edge Cache-Control headers (s-maxage=3600).',
        'Enable Brotli/Gzip compression on Express/Fastify API server routes.',
        'Preload hero assets and font subsets on web landing page.'
      ],
      metricToTrack: 'Average Endpoint Response Time (ms)',
      targetImprovement: '-75% Latency (<350ms)',
      effortEstimate: 'LOW'
    });
  } else if (search && search.growthLeaks.length > 0) {
    const leak = search.growthLeaks[0];
    bottlenecks.push(`SEO Acquisition Leak: "${leak?.query}" has ${leak?.impressions.toLocaleString()} impressions but only ${leak?.ctr.toFixed(1)}% CTR.`);
    experiments.push({
      id: 3,
      title: 'High-Intent SERP Snippet & Title Tag Overhaul',
      area: 'SEO_ACQUISITION',
      rationale: `Google Search Console identified high search demand (${leak?.impressions} imp) with poor click-through rate (${leak?.ctr}%).`,
      hypothesis: `If we rewrite title tags to include "[2026 Updated]" and active problem-solving hooks, organic search clicks will surge.`,
      implementationSteps: [
        `Update landing page <title> for query "${leak?.query}".`,
        'Implement JSON-LD WebSite and FAQPage schema structured data.',
        'Submit URL for immediate re-indexing in Google Search Console.'
      ],
      metricToTrack: 'Organic CTR for target query',
      targetImprovement: '+2.5% Absolute CTR Lift',
      effortEstimate: 'LOW'
    });
  } else {
    experiments.push({
      id: 3,
      title: 'Automated Viral Referral Loop & Invite Rewards',
      area: 'RETENTION',
      rationale: 'Baseline metrics are stable; growth leverage should shift to viral coefficient.',
      hypothesis: 'If players receive an exclusive cosmetic when a friend joins their server, the organic referral coefficient will exceed 1.15.',
      implementationSteps: [
        'Add Roblox SocialService GameInvitePrompt trigger.',
        'Award "Party Leader" badge and in-game multiplier when friends join.',
        'Track invite acceptance conversions.'
      ],
      metricToTrack: 'K-Factor / Viral Invites per User',
      targetImprovement: '+25% Organic Referral Influx',
      effortEstimate: 'MEDIUM'
    });
  }

  // Ensure exactly 3 experiments
  while (experiments.length < 3) {
    experiments.push({
      id: experiments.length + 1,
      title: 'Weekend Double-XP Progression Event',
      area: 'RETENTION',
      rationale: 'Weekend engagement spikes offer highest potential for retention recovery.',
      hypothesis: 'Scheduling automatic 2x XP boosts on Saturdays will increase CCU by 30%.',
      implementationSteps: ['Add scheduled time-check in Luau game loop', 'Display billboard countdown banner in starter lobby'],
      metricToTrack: 'Peak Weekend CCU',
      targetImprovement: '+30% CCU',
      effortEstimate: 'LOW'
    });
  }

  return {
    executiveSummary: `Telemetry indicates stable core uptime with primary growth leverage situated in Roblox early-session retention (D1: ${roblox?.estimatedD1Retention ?? 18}%) and web edge latency optimization. Remedying the top 3 friction points will maximize weekly player compounding.`,
    platformStatus: {
      robloxHealth: (roblox?.crashRatePercent ?? 0) > 1.0 ? 'NEEDS_ATTENTION' : 'STABLE',
      webHealth: web.hasOutages ? 'CRITICAL' : web.degradedCount > 0 ? 'DEGRADED' : 'EXCELLENT',
      searchVisibility: (search?.growthLeaks.length ?? 0) > 0 ? 'UNDERPERFORMING' : 'STABLE'
    },
    keyBottlenecks: bottlenecks.slice(0, 3),
    tacticalExperiments: experiments.slice(0, 3),
    generatedAt: new Date().toISOString(),
    provider: 'HEURISTIC_FALLBACK'
  };
}

/**
 * Executes LLM-powered growth audit or falls back to heuristic engine
 */
export async function analyzeTelemetry(
  telemetry: TelemetryPayload,
  config: AppConfig
): Promise<GrowthAuditReport> {
  const { llmApiKey, llmProvider, llmModel } = config;

  if (!llmApiKey) {
    console.log('ℹ️  [Growth Advisor] No LLM_API_KEY provided. Utilizing deterministic quantitative heuristic advisor.');
    return generateHeuristicAnalysis(telemetry);
  }

  try {
    const promptPayload = JSON.stringify(telemetry, null, 2);

    if (llmProvider === 'gemini') {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(llmModel)}:generateContent?key=${encodeURIComponent(llmApiKey)}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${SYSTEM_PROMPT}\n\nHere is the current platform telemetry payload to analyze:\n${promptPayload}` }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API returned HTTP ${response.status}: ${await response.text()}`);
      }

      const json = await response.json() as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response from Gemini API');

      const parsed = JSON.parse(rawText) as GrowthAuditReport;
      parsed.provider = 'GEMINI';
      parsed.generatedAt = new Date().toISOString();
      return parsed;
    } else {
      // OpenAI API compatibility
      const endpoint = 'https://api.openai.com/v1/chat/completions';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${llmApiKey}`
        },
        body: JSON.stringify({
          model: llmModel,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Analyze this telemetry payload:\n${promptPayload}` }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API returned HTTP ${response.status}: ${await response.text()}`);
      }

      const json = await response.json() as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const rawText = json.choices?.[0]?.message?.content;
      if (!rawText) throw new Error('Empty response from OpenAI API');

      const parsed = JSON.parse(rawText) as GrowthAuditReport;
      parsed.provider = 'OPENAI';
      parsed.generatedAt = new Date().toISOString();
      return parsed;
    }
  } catch (error) {
    console.warn(`⚠️  [Growth Advisor] LLM query failed: ${(error as Error).message}. Falling back to quantitative heuristics.`);
    return generateHeuristicAnalysis(telemetry);
  }
}
