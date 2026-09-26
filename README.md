# 🚀 Side-Hustle Telemetry

> Production-ready Node.js / TypeScript automation engine designed to track side hustles (specifically **Roblox games** and **web applications**), monitor errors and uptime, feed aggregated metrics into an **LLM Growth Advisor** for actionable strategy, and broadcast structured rich embeds to **Discord Webhooks**. Powered by GitHub Actions with zero server infrastructure costs.

---

## 🌟 Key Architecture & Capabilities

```
┌────────────────────────────────────────────────────────┐
│               GitHub Actions Automation                │
│  - Hourly Health Ping (Fast uptime & latency check)    │
│  - Weekly Strategic Audit (Deep analysis + AI advisor) │
└──────────┬───────────────────────────────┬─────────────┘
           │                               │
           ▼                               ▼
┌──────────────────────┐       ┌────────────────────────┐
│  Roblox Open Cloud   │       │   Web Endpoint Sentry  │
│  - CCU & Peak Flow   │       │  - Concurrent latency  │
│  - Robux Revenue     │       │  - HTTP 2xx/4xx/5xx    │
│  - D1 Retention Est. │       │  - SSL validity check  │
└──────────┬───────────┘       └───────────┬────────────┘
           │                               │
           └───────────────┬───────────────┘
                           ▼
           ┌───────────────────────────────┐
           │     Google Search Console     │
           │  - High Imp / Low CTR Leaks   │
           └───────────────┬───────────────┘
                           ▼
           ┌───────────────────────────────┐
           │      AI Growth Advisor        │
           │  - Gemini / OpenAI Structured │
           │  - Heuristic Fallback Engine  │
           │  - 3 Testable Experiments/Wk  │
           └───────────────┬───────────────┘
                           ▼
           ┌───────────────────────────────┐
           │     Discord Rich Notifier     │
           │  - Rate-limit backoff handler │
           │  - Color-coded Embed Cards    │
           └───────────────────────────────┘
```

- **Graceful Degradation:** If one external API times out or credentials expire, the pipeline logs the warning to Discord and continues uninterrupted across all remaining platforms.
- **Offline Mock Run Mode:** Test the entire pipeline instantly without credentials using `--mock`.
- **In-Game Error Sentry (Luau):** Drop-in `ServerScriptService` script that buffers, deduplicates, and dispatches runtime crashes to prevent alert spam.
- **Actionable Growth Strategy:** Prescribes 3 quantitative experiments every week complete with hypotheses, step-by-step action items, and target metrics.

---

## 📂 Project Structure

```
.
├── .github/
│   └── workflows/
│       ├── weekly-growth-audit.yml   # Runs Sunday at midnight UTC; executes full LLM growth audit
│       └── hourly-health-ping.yml    # Runs every 60 minutes; fast uptime and critical error checks
├── src/
│   ├── config.ts                     # Zod-validated environment config with fallbacks
│   ├── types.ts                      # Strict TypeScript interfaces for metrics & embeds
│   ├── collectors/
│   │   ├── roblox.ts                 # Queries Roblox Open Cloud for CCU, revenue, visits
│   │   ├── web-health.ts             # Concurrent HTTP latency, status, and SSL expiration checker
│   │   └── search-console.ts         # Pulls Search Console queries & flags CTR growth leaks
│   ├── analyzers/
│   │   └── growth-advisor.ts         # Gemini/OpenAI structured prompt + heuristic fallback
│   ├── notifiers/
│   │   └── discord.ts                # Builds Discord embeds with 429 exponential backoff
│   └── index.ts                      # Master CLI orchestrator
├── luau/
│   └── ErrorLogger.luau              # Drop-in Luau script for Roblox ServerScriptService
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## ⚡ Quickstart & Mock Testing

You can run and test the complete pipeline immediately with synthetic telemetry:

```bash
# 1. Clone repository
git clone https://github.com/robzzzzu-cmd/side-hustle-telemetry.git
cd side-hustle-telemetry

# 2. Install dependencies
npm install

# 3. Execute mock weekly strategic growth audit
npm run test:mock

# 4. Execute mock hourly health ping
npm run test:health:mock
```

Both mock commands will execute without requiring any external API keys and output the formatted embeds directly to your terminal.

---

## 🔐 GitHub Secrets Configuration

To run live telemetry in GitHub Actions, navigate to **Settings -> Secrets and variables -> Actions** in your GitHub repository and add the following secrets:

| Secret Name | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `DISCORD_WEBHOOK_URL` | **Yes** | Discord Webhook URL for status reports | `https://discord.com/api/webhooks/123/xyz` |
| `LLM_API_KEY` | Optional | Gemini or OpenAI API Key (defaults to heuristic engine if omitted) | `AIzaSy...` or `sk-proj-...` |
| `LLM_PROVIDER` | Optional | `gemini` (default) or `openai` | `gemini` |
| `LLM_MODEL` | Optional | Specific model identifier | `gemini-1.5-flash` or `gpt-4o-mini` |
| `ROBLOX_OPENCLOUD_KEY` | Optional | Roblox Open Cloud API Key | `rbx_live_...` |
| `ROBLOX_UNIVERSE_ID` | Optional | Numeric Roblox Universe ID | `5812948291` |
| `MONITORED_URLS` | Optional | Comma-separated list of web endpoints | `https://myapp.com,https://api.myapp.com/health` |
| `SEARCH_CONSOLE_ENABLED` | Optional | Set to `true` to enable GSC telemetry | `false` |
| `ENABLE_MOCK` | Optional | Set to `true` to force mock data in GitHub Actions | `false` |

---

## 🎮 Roblox Integration Guide

### 1. Roblox Open Cloud Setup
1. Navigate to the [Roblox Creator Dashboard](https://create.roblox.com/dashboard/credentials).
2. Select **Open Cloud -> API Keys** and click **Create API Key**.
3. Add the following permissions:
   - `Universe Analytics` (Read)
   - `DataStore` (Read)
4. Set IP restrictions to `0.0.0.0/0` (GitHub Actions runner pool) or generate fresh keys.
5. Copy the generated key into your GitHub Secrets as `ROBLOX_OPENCLOUD_KEY`.
6. Add your numeric Universe ID as `ROBLOX_UNIVERSE_ID`.

### 2. In-Game Error Logger (Luau)
1. Open your Roblox project in **Roblox Studio**.
2. Navigate to the Explorer pane -> `ServerScriptService`.
3. Create a new Script named `ErrorLogger`.
4. Copy and paste the entire contents of [`luau/ErrorLogger.luau`](luau/ErrorLogger.luau).
5. Paste your Discord Webhook or alerting URL into `CONFIG.ENDPOINT_URL`.
6. Go to **Game Settings -> Security** and toggle **Allow HTTP Requests** to **ON**.

---

## 📈 Search Console "Growth Leaks" Logic

The engine automatically scans queries with high search impressions (>300) where CTR is lagging under 2.0%:
- Identifies queries where users find your page on Google but choose competitor snippets.
- Generates tactical title tag and structured metadata copywriting recommendations.
- Feeds leaks into the LLM Growth Advisor to craft A/B testing hypotheses.

---

## 🤖 AI Growth Advisor Specification

The analyzer prompt enforces structured quantitative outputs:

> *"You are a quantitative growth strategist for indie games and web apps. Analyze telemetry, diagnose conversion friction and retention bottlenecks, and prescribe exactly 3 high-impact, testable experiments for the coming week."*

### Heuristic Fallback
If the LLM endpoint is unreachable or `LLM_API_KEY` is not provided, the engine runs a deterministic heuristic analyzer that maps:
- D1 Retention `< 20%` ➔ FTUE Tutorial Milestone Acceleration
- Revenue/Player `< 1.5 R$` ➔ Impulse Micro-Gamepass Introduction
- Web Latency `> 2000ms` ➔ Stale-while-revalidate Edge Caching
- High Imp / Low CTR ➔ Meta Title Hook Rewrites

---

## 📄 License
MIT License. Created by [robzzzzu-cmd](https://github.com/robzzzzu-cmd).
