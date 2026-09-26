import 'dotenv/config';
import { z } from 'zod';
import type { AppConfig, ExecutionMode, LLMProvider } from './types.js';

// Parse command-line arguments
const args = process.argv.slice(2);
const hasMockFlag = args.includes('--mock');
const modeArgIndex = args.indexOf('--mode');
const cliMode: ExecutionMode = modeArgIndex !== -1 && args[modeArgIndex + 1]
  ? (args[modeArgIndex + 1].toLowerCase() as ExecutionMode)
  : (process.env.MODE?.toLowerCase() as ExecutionMode) || 'audit';

const rawEnvSchema = z.object({
  DISCORD_WEBHOOK_URL: z.string().optional().default(''),
  LLM_API_KEY: z.string().optional(),
  LLM_PROVIDER: z.enum(['gemini', 'openai']).optional().default('gemini'),
  LLM_MODEL: z.string().optional(),
  ROBLOX_OPENCLOUD_KEY: z.string().optional(),
  ROBLOX_UNIVERSE_ID: z.string().optional(),
  MONITORED_URLS: z.string().optional().default(''),
  ENABLE_MOCK: z.preprocess((val) => {
    if (typeof val === 'string') return val.toLowerCase() === 'true';
    return Boolean(val);
  }, z.boolean()).optional().default(false),
  SEARCH_CONSOLE_ENABLED: z.preprocess((val) => {
    if (typeof val === 'string') return val.toLowerCase() === 'true';
    return Boolean(val);
  }, z.boolean()).optional().default(false),
});

export function loadConfig(): AppConfig {
  const parsedEnv = rawEnvSchema.parse(process.env);
  const isMock = hasMockFlag || parsedEnv.ENABLE_MOCK;

  // Resolve Monitored URLs (comma-separated list, trimmed, non-empty)
  let monitoredUrls: string[] = [];
  if (parsedEnv.MONITORED_URLS) {
    monitoredUrls = parsedEnv.MONITORED_URLS
      .split(',')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
  }

  // Provide realistic defaults in mock mode if not specified
  if (isMock && monitoredUrls.length === 0) {
    monitoredUrls = [
      'https://my-indie-game-landing.com',
      'https://api.my-indie-app.com/health',
      'https://docs.my-project.org'
    ];
  }

  // Discord Webhook validation
  let webhookUrl = parsedEnv.DISCORD_WEBHOOK_URL.trim();
  if (!webhookUrl) {
    if (isMock) {
      webhookUrl = 'https://discord.com/api/webhooks/mock/placeholder';
    } else {
      console.warn('⚠️  [Config] DISCORD_WEBHOOK_URL is missing. Notifications will be printed to stdout only.');
      webhookUrl = '';
    }
  }

  const llmProvider = parsedEnv.LLM_PROVIDER as LLMProvider;
  const llmModel = parsedEnv.LLM_MODEL || (llmProvider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash');

  return {
    discordWebhookUrl: webhookUrl,
    llmApiKey: parsedEnv.LLM_API_KEY,
    llmProvider,
    llmModel,
    robloxOpenCloudKey: parsedEnv.ROBLOX_OPENCLOUD_KEY,
    robloxUniverseId: parsedEnv.ROBLOX_UNIVERSE_ID,
    monitoredUrls,
    enableMock: isMock,
    searchConsoleEnabled: parsedEnv.SEARCH_CONSOLE_ENABLED,
    mode: cliMode === 'health' ? 'health' : 'audit'
  };
}
