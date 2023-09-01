import { type NextIncomingMessage } from 'next/dist/server/request-meta';
import { headers } from 'next/headers';

export async function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>,
  req?: NextIncomingMessage,
): Promise<void> {
  const appKey = globalThis.__APTABASE__.appKey;
  if (!appKey) return Promise.resolve();

  const userAgent = getUserAgent(req);
  if (!userAgent) return Promise.resolve();

  const body = JSON.stringify({
    timestamp: new Date().toISOString(),
    sessionId: 'CHANGE-THIS',
    eventName: eventName,
    systemProps: {
      isDebug: true,
      locale: 'en',
      appVersion: '',
      sdkVersion: 'aptabase-nextjs@0.0.1',
    },
    props: props,
  });

  try {
    const response = await fetch('http://localhost:3000/api/v0/event', {
      method: 'POST',
      headers: {
        'User-Agent': userAgent,
        'Content-Type': 'application/json',
        'App-Key': appKey,
      },
      credentials: 'omit',
      body,
    });

    if (response.status >= 300) {
      const responseBody = await response.text();
      console.warn(`Failed to send event "${eventName}": ${response.status} ${responseBody}`);
    }
  } catch (e) {
    console.warn(`Failed to send event "${eventName}": ${e}`);
  }
}

function getUserAgent(req?: NextIncomingMessage): string | undefined {
  if (req) {
    return req.headers['user-agent'] ?? 'Unknown';
  }

  // headers() might throw an error if called outside of a request context.
  try {
    return headers().get('User-Agent') ?? 'Unknown';
  } catch {}

  // If we're here, we're probably using the Pages Router and the user forgot to pass the req parameter.
  if (!req) {
    console.warn("Aptabase: The 'req' parameter of trackEvent is required when using Pages Router.");
  }

  return undefined;
}
