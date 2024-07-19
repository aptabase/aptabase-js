let defaultLocale: string | undefined;
let defaultIsDebug: boolean | undefined;
const isInBrowser = typeof window !== 'undefined' && typeof window.fetch !== 'undefined';
const isInBrowserExtension = typeof chrome !== 'undefined' && !!chrome.runtime?.id;

let _sessionId = newSessionId();
let _lastTouched = new Date();

const _hosts: { [region: string]: string } = {
  US: 'https://us.aptabase.com',
  EU: 'https://eu.aptabase.com',
  DEV: 'http://localhost:3000',
  SH: '',
};

export type AptabaseOptions = {
  // Custom host for self-hosted Aptabase.
  host?: string;
  // Custom path for API endpoint. Useful when using reverse proxy.
  apiUrl?: string;
  // Defines the app version.
  appVersion?: string;
  // Defines whether the app is running on debug mode.
  isDebug?: boolean;
};

export function inMemorySessionId(timeout: number): string {
  let now = new Date();
  const diffInMs = now.getTime() - _lastTouched.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  if (diffInSec > timeout) {
    _sessionId = newSessionId();
  }
  _lastTouched = now;

  return _sessionId;
}

export function newSessionId(): string {
  const epochInSeconds = Math.floor(Date.now() / 1000).toString();
  const random = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, '0');

  return epochInSeconds + random;
}

export function validateAppKey(appKey: string): boolean {
  const parts = appKey.split('-');
  if (parts.length !== 3 || _hosts[parts[1]] === undefined) {
    console.warn(`The Aptabase App Key "${appKey}" is invalid. Tracking will be disabled.`);
    return false;
  }
  return true;
}

export function getApiUrl(appKey: string, options?: AptabaseOptions): string | undefined {
  const region = appKey.split('-')[1];
  if (region === 'SH') {
    if (!options?.host) {
      console.warn(`Host parameter must be defined when using Self-Hosted App Key. Tracking will be disabled.`);
      return;
    }

    return `${options.host}/api/v0/event`;
  }

  const host = options?.host ?? _hosts[region];
  return `${host}/api/v0/event`;
}

export async function sendEvent(opts: {
  apiUrl: string;
  appKey?: string;
  sessionId: string;
  locale?: string;
  isDebug?: boolean;
  appVersion?: string;
  sdkVersion: string;
  eventName: string;
  props?: Record<string, string | number | boolean>;
}): Promise<void> {
  if (!isInBrowser && !isInBrowserExtension) {
    console.warn(`Aptabase: trackEvent requires a browser environment. Event "${opts.eventName}" will be discarded.`);
    return;
  }

  if (!opts.appKey) {
    console.warn(`Aptabase: init must be called before trackEvent. Event "${opts.eventName}" will be discarded.`);
    return;
  }

  try {
    const response = await fetch(opts.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'App-Key': opts.appKey,
      },
      credentials: 'omit',
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        sessionId: opts.sessionId,
        eventName: opts.eventName,
        systemProps: {
          locale: opts.locale ?? getBrowserLocale(),
          isDebug: opts.isDebug ?? getIsDebug(),
          appVersion: opts.appVersion ?? '',
          sdkVersion: opts.sdkVersion,
        },
        props: opts.props,
      }),
    });

    if (response.status >= 300) {
      const responseBody = await response.text();
      console.warn(`Failed to send event "${opts.eventName}": ${response.status} ${responseBody}`);
    }
  } catch (e) {
    console.warn(`Failed to send event "${opts.eventName}"`);
    console.warn(e);
  }
}

function getBrowserLocale(): string | undefined {
  if (defaultLocale) {
    return defaultLocale;
  }

  if (typeof navigator === 'undefined') {
    return undefined;
  }

  if (navigator.languages.length > 0) {
    defaultLocale = navigator.languages[0];
  } else {
    defaultLocale = navigator.language;
  }

  return defaultLocale;
}

function getIsDebug(): boolean {
  if (defaultIsDebug !== undefined) {
    return defaultIsDebug;
  }

  if (process.env['NODE_ENV'] === 'development') {
    defaultIsDebug = true;
    return defaultIsDebug;
  }

  if (typeof location === 'undefined') {
    defaultIsDebug = false;
    return defaultIsDebug;
  }

  defaultIsDebug = location.hostname === 'localhost';

  return defaultIsDebug;
}