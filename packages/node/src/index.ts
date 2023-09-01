import { AptabaseOptions } from './types';

export { AptabaseOptions };

const isDebug = process.env.NODE_ENV === 'development';

const _hosts: { [region: string]: string } = {
  US: 'https://us.aptabase.com',
  EU: 'https://eu.aptabase.com',
  DEV: 'http://localhost:3000',
  SH: '',
};

export function init(appKey: string, options?: AptabaseOptions) {
  const parts = appKey.split('-');
  if (parts.length !== 3 || _hosts[parts[1]] === undefined) {
    console.warn(`Aptabase: The App Key "${appKey}" is invalid. Tracking will be disabled.`);
    return;
  }

  const baseUrl = getBaseUrl(parts[1], options);
  const apiUrl = `${baseUrl}/api/v0/event`;
  globalThis.__APTABASE__ = { appKey, apiUrl, options };
}

// We only need the headers from the request object
type PartialRequest = Pick<Request, 'headers'>;

export async function trackEvent(
  req: PartialRequest,
  eventName: string,
  props?: Record<string, string | number | boolean>,
): Promise<void> {
  const { appKey, apiUrl, options } = globalThis.__APTABASE__ || {};
  if (!appKey) return Promise.resolve();

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'User-Agent': req.headers.get('user-agent') ?? '',
        'Content-Type': 'application/json',
        'App-Key': appKey,
      },
      credentials: 'omit',
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        sessionId: 'CHANGE-THIS',
        eventName: eventName,
        systemProps: {
          isDebug,
          locale: extractLocale(req.headers.get('accept-language')),
          appVersion: options,
          sdkVersion: globalThis.__APTABASE_SDK_VERSION__ ?? `aptabase-node@${process.env.PKG_VERSION}`,
        },
        props: props,
      }),
    });

    if (response.status >= 300) {
      const responseBody = await response.text();
      console.warn(`Failed to send event "${eventName}": ${response.status} ${responseBody}`);
    }
  } catch (e) {
    console.warn(`Failed to send event "${eventName}": ${e}`);
  }
}

function getBaseUrl(region: string, options?: AptabaseOptions): string | undefined {
  if (region === 'SH') {
    if (!options?.host) {
      console.warn(`Host parameter must be defined when using Self-Hosted App Key. Tracking will be disabled.`);
      return;
    }
    return options.host;
  }

  return _hosts[region];
}

function extractLocale(locale: string | null): string | null {
  if (!locale) {
    return null;
  }

  const languageLocales = locale.split(',');
  const firstLanguageLocale = languageLocales[0];
  if (!firstLanguageLocale) {
    return null;
  }
  const [language] = firstLanguageLocale.split(';');
  return language || null;
}
