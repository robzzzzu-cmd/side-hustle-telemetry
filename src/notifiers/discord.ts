import type {
  AppConfig,
  DiscordEmbed,
  DiscordWebhookPayload,
  GrowthAuditReport,
  RobloxTelemetry,
  TelemetryPayload,
  WebHealthReport
} from '../types.js';

// Color Palette Constants
export const COLORS = {
  GREEN: 0x2ecc71,      // Operational & Healthy
  ORANGE: 0xe67e22,     // Degraded / Latency Warning / Opportunities
  RED: 0xe74c3c,        // Outage / Critical Error
  BLURPLE: 0x5865f2,    // Strategic Weekly Briefing
  DARK: 0x2b2d31        // Fallback neutral
};

/**
 * Builds the fast Hourly Health Ping Discord Embed
 */
export function buildHealthCheckEmbed(
  webHealth: WebHealthReport,
  roblox: RobloxTelemetry | null,
  errors: TelemetryPayload['errors']
): DiscordEmbed {
  const isHealthy = !webHealth.hasOutages && webHealth.degradedCount === 0 && errors.length === 0;
  const isCritical = webHealth.hasOutages;
  const color = isCritical ? COLORS.RED : isHealthy ? COLORS.GREEN : COLORS.ORANGE;

  const titleStatus = isCritical
    ? '🚨 CRITICAL OUTAGE DETECTED'
    : isHealthy
      ? '🟢 All Systems Operational'
      : '⚠️ Performance Degradation Alert';

  const fields = [];

  // Web Endpoints Summary
  if (webHealth.totalMonitored > 0) {
    const endpointDetails = webHealth.endpoints
      .map((e) => {
        const icon = e.status === 'HEALTHY' ? '🟢' : e.status === 'DEGRADED' ? '🟠' : '🔴';
        const ssl = e.sslDaysRemaining !== null ? `(SSL: ${e.sslDaysRemaining}d)` : '';
        return `${icon} \`${e.url}\`\n└ **Status:** ${e.statusCode || 'ERR'} | **Latency:** ${e.responseTimeMs}ms ${ssl}`;
      })
      .join('\n');

    fields.push({
      name: `🌐 Monitored Web Endpoints (${webHealth.healthyCount}/${webHealth.totalMonitored} Passing)`,
      value: endpointDetails,
      inline: false
    });
  }

  // Roblox Pulse Summary
  if (roblox) {
    const robloxIcon = roblox.crashRatePercent > 1.0 ? '🟠' : '🟢';
    fields.push({
      name: `🎮 Roblox Universe Health (${roblox.placeName})`,
      value: `${robloxIcon} **CCU:** ${roblox.currentCcu.toLocaleString()} players | **Servers:** ${roblox.activeServerCount}\n└ **Crash Rate:** ${roblox.crashRatePercent}% | **Visits Today:** ${roblox.dailyVisits.toLocaleString()}${roblox.isMock ? ' *(Simulated)*' : ''}`,
      inline: false
    });
  }

  // Pipeline Errors & Warnings
  if (errors.length > 0) {
    const errorText = errors
      .slice(0, 3)
      .map((e) => `• [${e.source}] ${e.message}`)
      .join('\n');
    fields.push({
      name: '⚠️ System Degradation Warnings',
      value: errorText,
      inline: false
    });
  }

  return {
    title: titleStatus,
    description: `Hourly automated telemetry heartbeat. Monitored at **${new Date().toUTCString()}**.`,
    color,
    fields,
    footer: {
      text: 'Side-Hustle Telemetry • GitHub Actions Automation Engine'
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Builds the Weekly Strategic Growth Briefing Discord Embed
 */
export function buildWeeklyAuditEmbed(
  audit: GrowthAuditReport,
  telemetry: TelemetryPayload
): DiscordEmbed {
  const fields = [];

  // 1. Platform Metrics Scorecard
  const roblox = telemetry.roblox;
  const web = telemetry.webHealth;
  const search = telemetry.searchConsole;

  const robloxMetrics = roblox
    ? `• **Live CCU:** ${roblox.currentCcu.toLocaleString()}\n• **D1 Retention:** ${roblox.estimatedD1Retention}%\n• **Est. Weekly Robux:** ${(roblox.robuxRevenueDaily * 7).toLocaleString()} R$`
    : 'No active Roblox telemetry.';

  const webMetrics = `• **Uptime:** ${web.healthyCount}/${web.totalMonitored} Online\n• **Avg Latency:** ${web.avgLatencyMs}ms\n• **Outages:** ${web.downCount}`;

  const searchMetrics = search
    ? `• **Weekly Impressions:** ${search.totalImpressions.toLocaleString()}\n• **Average CTR:** ${search.overallCtr}%\n• **Growth Leaks:** ${search.growthLeaks.length} flagged`
    : 'GSC not enabled.';

  fields.push(
    { name: '🎮 Roblox Gaming', value: robloxMetrics, inline: true },
    { name: '🌐 Web Services', value: webMetrics, inline: true },
    { name: '🔍 Search Acquisition', value: searchMetrics, inline: true }
  );

  // 2. Identified Bottlenecks
  if (audit.keyBottlenecks.length > 0) {
    const bottlenecksText = audit.keyBottlenecks.map((b, idx) => `**${idx + 1}.** ${b}`).join('\n');
    fields.push({
      name: '🛑 Diagnosed Growth Bottlenecks',
      value: bottlenecksText,
      inline: false
    });
  }

  // 3. Three Tactical Experiments
  audit.tacticalExperiments.forEach((exp, i) => {
    const areaIcons = {
      RETENTION: '🔄',
      MONETIZATION: '💰',
      SEO_ACQUISITION: '🎯',
      PERFORMANCE: '⚡'
    };
    const icon = areaIcons[exp.area] || '🧪';

    const experimentDetails = [
      `*${exp.rationale}*`,
      `**Hypothesis:** ${exp.hypothesis}`,
      `**Action Items:**\n${exp.implementationSteps.map((s) => `└ • ${s}`).join('\n')}`,
      `**Target Metric:** \`${exp.metricToTrack}\` (${exp.targetImprovement}) | **Effort:** \`${exp.effortEstimate}\``
    ].join('\n');

    fields.push({
      name: `${icon} Experiment #${i + 1}: ${exp.title}`,
      value: experimentDetails,
      inline: false
    });
  });

  return {
    title: '📈 Strategic Weekly Telemetry & Growth Audit',
    description: `**Executive Summary:**\n${audit.executiveSummary}`,
    color: COLORS.BLURPLE,
    fields,
    footer: {
      text: `Analyzed via ${audit.provider} • Side-Hustle Telemetry Engine`
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Dispatches the Discord payload with exponential backoff on HTTP 429 rate limits
 */
export async function sendDiscordNotification(
  payload: DiscordWebhookPayload,
  config: AppConfig
): Promise<void> {
  const { discordWebhookUrl, enableMock } = config;

  if (!discordWebhookUrl || discordWebhookUrl.includes('mock/placeholder')) {
    console.log('\n=================== 📨 DISCORD NOTIFICATION (MOCK/CONSOLE) ===================');
    console.log(`To: [Simulated Webhook]`);
    console.log(`Embeds count: ${payload.embeds.length}`);
    payload.embeds.forEach((embed, i) => {
      console.log(`\n--- EMBED #${i + 1}: ${embed.title} ---`);
      if (embed.description) console.log(embed.description);
      embed.fields?.forEach((f) => {
        console.log(`\n[${f.name}]\n${f.value}`);
      });
      if (embed.footer) console.log(`\nFooter: ${embed.footer.text}`);
    });
    console.log('===============================================================================\n');
    return;
  }

  const maxRetries = 3;
  let attempt = 0;
  let delayMs = 1000;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.status === 204 || response.status === 200) {
        console.log('✅ [Discord Notifier] Successfully posted embed to Discord channel.');
        return;
      }

      if (response.status === 429) {
        const rateLimitData = await response.json().catch(() => ({})) as { retry_after?: number };
        const waitTime = rateLimitData.retry_after ? Math.ceil(rateLimitData.retry_after * 1000) : delayMs;
        console.warn(`⏳ [Discord Notifier] 429 Rate limited. Backing off for ${waitTime}ms (Attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise((r) => setTimeout(r, waitTime));
        attempt++;
        delayMs *= 2;
        continue;
      }

      throw new Error(`Discord API returned HTTP ${response.status}: ${await response.text()}`);
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`❌ [Discord Notifier] Exceeded retry limit. Failed to post to Discord: ${(error as Error).message}`);
        return;
      }
      attempt++;
      await new Promise((r) => setTimeout(r, delayMs));
      delayMs *= 2;
    }
  }
}
