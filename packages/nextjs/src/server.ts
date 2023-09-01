import { headers } from 'next/headers';

export async function trackEvent(eventName: string, props?: Record<string, string | number | boolean>): Promise<void> {
  const appKey = globalThis.__APTABASE__.appKey;
  if (!appKey) return Promise.resolve();

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
        'User-Agent': headers().get('User-Agent') ?? '',
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
