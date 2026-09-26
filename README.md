# 🚀 Side-Hustle Telemetry & Pixel Studio HQ

> Production-ready Node.js / TypeScript automation engine and retro 16-bit pixel-art web dashboard designed to track side hustles (specifically **Roblox games** and **web applications**), monitor errors and uptime, feed aggregated metrics into an **LLM Growth Advisor** for actionable strategy, and broadcast structured rich embeds to **Discord Webhooks**. Powered by GitHub Actions with zero server infrastructure costs.

---

## 🕹️ Pixel Studio HQ • Retro 16-Bit Web Dashboard

An interactive, responsive 16-bit retro pixel-art office simulation built with **React**, **Vite**, **Tailwind CSS**, and **HTML5 Canvas**.

```
┌────────────────────────────────────────────────────────────────────────┐
│  🕹️ PIXEL STUDIO HQ • TOP HUD: $1,485.50 • 99.9% Uptime • 142 CCU [CRT] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [DESK 1: ROBLOX DEV]       [DESK 4: AI DIRECTOR]    [DESK 3: SEO]    │
│    • Working (Green Code)     • Pacing Floor           • Whiteboard    │
│    • Crashing (Smoke Puffs)   • Cyan Cyber Visor       • Speech Bubble │
│    • Booming (Gold Coins)     • 3 Growth Experiments   • Leak Alerts   │
│                                                                        │
│                 [DESK 2: SYSADMIN & SERVER RACK]                       │
│                  • Normal: Blinking green/cyan LEDs                    │
│                  • Outage: Flashing siren & fire sparks                │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│   [SIMULATE STATE]:  [🟢 NOMINAL]   [🚨 WEB OUTAGE]   [💥 CRASH SPIKE]  │
└────────────────────────────────────────────────────────────────────────┘
```

### Dashboard Features
- **4 Dynamic Office Desks:**
  - **Desk 1 (Roblox Dev):** Animates typing loop. Reacts with dark smoke particle effects if runtime exceptions occur (`errorCount > 0`), or bouncing golden pixel coins when CCU spikes above 50!
  - **Desk 2 (Web Sysadmin):** Multi-rack server unit with animated blinking LEDs. Triggers a spinning red emergency siren beacon and leaping pixel flames if any monitored website goes down.
  - **Desk 3 (SEO Specialist):** Draws growth trajectory arrows on an office whiteboard. Displays floating cartoon speech bubbles flagging high-impression / low-CTR search queries (`>300 imp, <2.0% CTR`).
  - **Desk 4 (The AI Director):** A stylish executive with a cyan holographic cyber visor pacing across the office floor. Clicking the Director opens the **Weekly Strategic Directive** modal featuring 3 testable growth experiments and interactive confetti cannons.
- **Click-to-Inspect Modals:** Click any character or desk to reveal real-time gauges, Luau stack traces, endpoint latency tables, and search opportunities.
- **Retro Audio & CRT FX:** Built-in toggleable CRT scanlines + curved glass vignette, plus synthesized 8-bit chiptune sound effects powered natively by the Web Audio API (zero external audio files).
- **Interactive State Switcher:** Instantly preview Nominal/Booming, Web Outage, and Crash Spike scenarios directly in your browser.

### Running the Dashboard Locally
```bash
# Install dashboard dependencies
npm run dashboard:install

# Start the Vite development server
npm run dashboard:dev
# -> Visit http://localhost:3000
```

---

## 🌟 Automation Architecture & Capabilities

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
├── dashboard/                        # Retro 16-bit React/Vite/Tailwind Web Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── OfficeCanvas.tsx      # Procedural pixel-art office renderer with dynamic particle engine
│   │   │   ├── TopHUD.tsx            # NES-style HUD with revenue, uptime, and CCU counters
│   │   │   ├── RetroScanlines.tsx    # CRT scanlines & vignette overlay
│   │   │   ├── ScenarioControls.tsx  # Interactive state simulation switcher
│   │   │   └── Modals/               # Worker inspect & AI Strategic Directive dialogs
│   │   ├── utils/soundEffects.ts     # Procedural 8-bit audio synth via native Web Audio API
│   │   └── data/mockTelemetry.ts     # Realistic telemetry datasets (Nominal, Outage, Crashing)
│   ├── package.json
│   └── vite.config.ts
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

## ⚡ Quickstart & CLI Testing

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
3. Add permissions for `Universe Analytics` (Read) and `DataStore` (Read).
4. Copy the generated key into your GitHub Secrets as `ROBLOX_OPENCLOUD_KEY`.
5. Add your numeric Universe ID as `ROBLOX_UNIVERSE_ID`.

### 2. In-Game Error Logger (Luau)
1. Open your Roblox project in **Roblox Studio**.
2. In Explorer -> `ServerScriptService`, create a script named `ErrorLogger`.
3. Copy and paste [`luau/ErrorLogger.luau`](luau/ErrorLogger.luau).
4. Set `CONFIG.ENDPOINT_URL` to your Discord Webhook or alerting URL.
5. In **Game Settings -> Security**, toggle **Allow HTTP Requests** to **ON**.

---

## 📄 License
MIT License. Created by [robzzzzu-cmd](https://github.com/robzzzzu-cmd).
