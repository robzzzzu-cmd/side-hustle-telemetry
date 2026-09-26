import * as tls from 'node:tls';
import { URL } from 'node:url';
import type { AppConfig, HealthStatus, WebEndpointHealth, WebHealthReport } from '../types.js';

interface SSLCheckResult {
  valid: boolean;
  daysRemaining: number | null;
  expiryDate: string | null;
  error?: string;
}

/**
 * Inspects SSL certificate expiration and validity using native TLS socket
 */
function inspectSslCertificate(targetUrl: string, timeoutMs = 4000): Promise<SSLCheckResult> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      if (parsed.protocol !== 'https:') {
        return resolve({ valid: true, daysRemaining: null, expiryDate: null });
      }

      const port = parsed.port ? Number.parseInt(parsed.port, 10) : 443;
      const socket = tls.connect(
        {
          host: parsed.hostname,
          port,
          servername: parsed.hostname,
          timeout: timeoutMs,
          rejectUnauthorized: false // Inspect cert even if self-signed to diagnose
        },
        () => {
          const cert = socket.getPeerCertificate();
          socket.destroy();

          if (!cert || !cert.valid_to) {
            return resolve({
              valid: false,
              daysRemaining: null,
              expiryDate: null,
              error: 'No peer certificate found'
            });
          }

          const expiryDate = new Date(cert.valid_to);
          const now = new Date();
          const msRemaining = expiryDate.getTime() - now.getTime();
          const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
          const isValid = socket.authorized && daysRemaining > 0;

          resolve({
            valid: isValid,
            daysRemaining,
            expiryDate: expiryDate.toISOString(),
            error: socket.authorizationError ? String(socket.authorizationError) : undefined
          });
        }
      );

      socket.on('error', (err) => {
        socket.destroy();
        resolve({
          valid: false,
          daysRemaining: null,
          expiryDate: null,
          error: err.message
        });
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve({
          valid: false,
          daysRemaining: null,
          expiryDate: null,
          error: 'TLS handshake timeout'
        });
      });
    } catch (e) {
      resolve({
        valid: false,
        daysRemaining: null,
        expiryDate: null,
        error: (e as Error).message
      });
    }
  });
}

/**
 * Checks a single HTTP/HTTPS endpoint with latency measurement and SSL check
 */
async function checkEndpoint(url: string, timeoutMs = 6000): Promise<WebEndpointHealth> {
  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let statusCode: number | null = null;
  let error: string | null = null;
  let status: HealthStatus = 'HEALTHY';
  let responseTimeMs = 0;

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'SideHustleTelemetry/1.0 (+https://github.com/robzzzzu-cmd/side-hustle-telemetry)'
      }
    });

    clearTimeout(timeoutId);
    responseTimeMs = Math.round(performance.now() - startTime);
    statusCode = response.status;

    if (response.status >= 200 && response.status < 300) {
      if (responseTimeMs > 2000) {
        status = 'DEGRADED'; // High latency anomaly
      } else {
        status = 'HEALTHY';
      }
    } else if (response.status >= 300 && response.status < 400) {
      status = 'HEALTHY'; // Redirects are operational
    } else {
      status = 'DOWN';
      error = `HTTP ${response.status} ${response.statusText}`;
    }
  } catch (err) {
    clearTimeout(timeoutId);
    responseTimeMs = Math.round(performance.now() - startTime);
    status = 'DOWN';
    error = (err as Error).name === 'AbortError' ? 'Connection timed out (>6000ms)' : (err as Error).message;
  }

  // Inspect SSL certificate
  const ssl = await inspectSslCertificate(url);
  if (ssl.valid === false && status !== 'DOWN') {
    status = 'DEGRADED';
    error = error ? `${error} | SSL Issue: ${ssl.error}` : `SSL Issue: ${ssl.error}`;
  }

  return {
    url,
    status,
    statusCode,
    responseTimeMs,
    sslValid: ssl.valid,
    sslDaysRemaining: ssl.daysRemaining,
    sslExpiryDate: ssl.expiryDate,
    error,
    timestamp: new Date().toISOString()
  };
}

/**
 * Concurrently checks all target URLs and aggregates health status
 */
export async function collectWebHealth(config: AppConfig): Promise<WebHealthReport> {
  const { monitoredUrls, enableMock } = config;

  if (enableMock && monitoredUrls.length === 0) {
    return {
      endpoints: [
        {
          url: 'https://my-indie-game-landing.com',
          status: 'HEALTHY',
          statusCode: 200,
          responseTimeMs: 142,
          sslValid: true,
          sslDaysRemaining: 74,
          sslExpiryDate: new Date(Date.now() + 74 * 86400000).toISOString(),
          error: null,
          timestamp: new Date().toISOString()
        },
        {
          url: 'https://api.my-indie-app.com/health',
          status: 'DEGRADED',
          statusCode: 200,
          responseTimeMs: 2150, // Latency anomaly trigger
          sslValid: true,
          sslDaysRemaining: 18,
          sslExpiryDate: new Date(Date.now() + 18 * 86400000).toISOString(),
          error: 'Latency exceeded SLA threshold (2150ms > 2000ms)',
          timestamp: new Date().toISOString()
        }
      ],
      totalMonitored: 2,
      healthyCount: 1,
      degradedCount: 1,
      downCount: 0,
      avgLatencyMs: 1146,
      hasOutages: false,
      collectedAt: new Date().toISOString()
    };
  }

  if (monitoredUrls.length === 0) {
    return {
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

  // Execute checks concurrently using Promise.allSettled
  const results = await Promise.allSettled(monitoredUrls.map((url) => checkEndpoint(url)));

  const endpoints: WebEndpointHealth[] = results.map((res, index) => {
    if (res.status === 'fulfilled') {
      return res.value;
    }
    return {
      url: monitoredUrls[index] ?? 'unknown',
      status: 'DOWN',
      statusCode: null,
      responseTimeMs: 0,
      sslValid: null,
      sslDaysRemaining: null,
      sslExpiryDate: null,
      error: res.reason instanceof Error ? res.reason.message : String(res.reason),
      timestamp: new Date().toISOString()
    };
  });

  const healthyCount = endpoints.filter((e) => e.status === 'HEALTHY').length;
  const degradedCount = endpoints.filter((e) => e.status === 'DEGRADED').length;
  const downCount = endpoints.filter((e) => e.status === 'DOWN').length;
  const totalLatency = endpoints.reduce((sum, e) => sum + e.responseTimeMs, 0);
  const avgLatencyMs = endpoints.length > 0 ? Math.round(totalLatency / endpoints.length) : 0;

  return {
    endpoints,
    totalMonitored: endpoints.length,
    healthyCount,
    degradedCount,
    downCount,
    avgLatencyMs,
    hasOutages: downCount > 0,
    collectedAt: new Date().toISOString()
  };
}
