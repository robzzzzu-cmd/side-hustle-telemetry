import { analyzeTelemetry } from './analyzers/growth-advisor.js';
import { collectRobloxTelemetry } from './collectors/roblox.js';
import { collectSearchConsoleMetrics } from './collectors/search-console.js';
import { collectWebHealth } from './collectors/web-health.js';
import { loadConfig } from './config.js';
import {
  buildHealthCheckEmbed,
  buildWeeklyAuditEmbed,
  sendDiscordNotification
} from './notifiers/discord.js';
import type { TelemetryPayload } from './types.js';

async function main() {
  console.log('🚀 [Side-Hustle Telemetry] Initializing pipeline...');
  const config = loadConfig();

  console.log(`⚙️  Mode: [${config.mode.toUpperCase()}] | Mock: [${config.enableMock}] | LLM: [${config.llmProvider}/${config.llmModel}]`);

  const errors: TelemetryPayload['errors'] = [];

  // 1. Concurrently Collect Telemetry with Graceful Degradation
  console.log('📡 Collecting platform metrics...');
  const [robloxResult, webResult, searchResult] = await Promise.allSettled([
    collectRobloxTelemetry(config),
    collectWebHealth(config),
    collectSearchConsoleMetrics(config)
  ]);

  let roblox = null;
  if (robloxResult.status === 'fulfilled') {
    roblox = robloxResult.value;
    console.log(`✅ Roblox collector finished: CCU ${roblox.currentCcu}, Visits ${roblox.totalVisits.toLocaleString()}`);
  } else {
    console.warn(`⚠️ Roblox collector failed: ${robloxResult.reason}`);
    errors.push({
      source: 'RobloxCollector',
      message: String(robloxResult.reason),
      timestamp: new Date().toISOString()
    });
  }

  let webHealth;
  if (webResult.status === 'fulfilled') {
    webHealth = webResult.value;
    console.log(`✅ Web Health collector finished: ${webHealth.healthyCount}/${webHealth.totalMonitored} healthy (Avg ${webHealth.avgLatencyMs}ms)`);
  } else {
    console.warn(`⚠️ Web Health collector failed: ${webResult.reason}`);
    errors.push({
      source: 'WebHealthCollector',
      message: String(webResult.reason),
      timestamp: new Date().toISOString()
    });
    webHealth = {
      endpoints: [],
      totalMonitored: 0,
      healthyCount: 0,
      degradedCount: 0,
      downCount: 0,
      avgLatencyMs: 0,
      hasOutages: false,
      collectedAt: new Date().toISOString()
    };
  }

  let searchConsole = null;
  if (searchResult.status === 'fulfilled') {
    searchConsole = searchResult.value;
    console.log(`✅ Search Console collector finished: ${searchConsole.growthLeaks.length} growth leaks identified`);
  } else {
    console.warn(`⚠️ Search Console collector failed: ${searchResult.reason}`);
    errors.push({
      source: 'SearchConsoleCollector',
      message: String(searchResult.reason),
      timestamp: new Date().toISOString()
    });
  }

  const telemetryPayload: TelemetryPayload = {
    timestamp: new Date().toISOString(),
    environment: config.enableMock ? 'mock' : 'production',
    roblox,
    webHealth,
    searchConsole,
    errors
  };

  // 2. Execute Branch: Hourly Health Ping vs Weekly Growth Audit
  if (config.mode === 'health') {
    console.log('🩺 Assembling Hourly Health Ping Discord embed...');
    const healthEmbed = buildHealthCheckEmbed(webHealth, roblox, errors);

    await sendDiscordNotification(
      {
        username: 'Side-Hustle Sentry',
        avatar_url: 'https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png',
        embeds: [healthEmbed]
      },
      config
    );
  } else {
    console.log('🧠 Running AI Growth Advisor analysis on collected metrics...');
    const auditReport = await analyzeTelemetry(telemetryPayload, config);

    console.log(`📋 Audit synthesized: [${auditReport.platformStatus.robloxHealth} Roblox | ${auditReport.platformStatus.webHealth} Web]`);
    console.log(`💡 Prescribed 3 Experiments: ${auditReport.tacticalExperiments.map((e) => e.title).join(', ')}`);

    console.log('📨 Assembling Weekly Strategic Audit Discord embed...');
    const auditEmbed = buildWeeklyAuditEmbed(auditReport, telemetryPayload);

    await sendDiscordNotification(
      {
        username: 'Growth Advisor AI',
        avatar_url: 'https://raw.githubusercontent.com/github/explore/main/topics/graphql/graphql.png',
        embeds: [auditEmbed]
      },
      config
    );
  }

  console.log('✨ [Side-Hustle Telemetry] Pipeline finished successfully.');
}

main().catch((err) => {
  console.error('💥 Fatal unhandled pipeline execution error:', err);
  process.exit(1);
});
