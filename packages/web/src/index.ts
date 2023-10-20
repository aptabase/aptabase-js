import { newSessionId } from './session';

export type AptabaseOptions = {
  host?: string;
  appVersion?: string;
  isDebug?: boolean;
};

const locale = getBrowserLocale();

// Session expires after 1 hour of inactivity
const SESSION_TIMEOUT = 1 * 60 * 60;
let _sessionId = newSessionId();
let _lastTouched = new Date();
let _appKey = '';
let _apiUrl = '';
let _isDebug = false;
let _appVersion = '';

const _hosts: { [region: string]: string } = {
  US: 'https://us.aptabase.com',
  EU: 'https://eu.aptabase.com',
  DEV: 'http://localhost:3000',
  SH: '',
};

export function init(appKey: string, options?: AptabaseOptions) {
  const parts = appKey.split('-');
  if (parts.length !== 3 || _hosts[parts[1]] === undefined) {
    console.warn(`The Aptabase App Key "${appKey}" is invalid. Tracking will be disabled.`);
    return;
  }

  const baseUrl = getBaseUrl(parts[1], options);
  _apiUrl = `${baseUrl}/api/v0/event`;
  _appKey = appKey;
  _isDebug = options?.isDebug ?? getIsDebug();
  _appVersion = options?.appVersion ?? '';
}

export async function trackEvent(eventName: string, props?: Record<string, string | number | boolean>): Promise<void> {
  if (!_appKey) return;

  if (typeof window === 'undefined' || !window.fetch) {
    console.warn(`Aptabase: trackEvent requires a browser environment. Event "${eventName}" will not be tracked.`);
    return;
  }

  let now = new Date();
  const diffInMs = now.getTime() - _lastTouched.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  if (diffInSec > SESSION_TIMEOUT) {
    _sessionId = newSessionId();
  }
  _lastTouched = now;

  try {
    const response = await window.fetch(_apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'App-Key': _appKey,
      },
      credentials: 'omit',
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        sessionId: _sessionId,
        eventName: eventName,
        systemProps: {
          locale,
          isDebug: _isDebug,
          appVersion: _appVersion,
          sdkVersion: globalThis.__APTABASE_SDK_VERSION__ ?? `aptabase-web@${process.env.PKG_VERSION}`,
        },
        props: props,
      }),
    });

    if (response.status >= 300) {
      const responseBody = await response.text();
      console.warn(`Failed to send event "${eventName}": ${response.status} ${responseBody}`);
    }
  } catch (e) {
    console.warn(`Failed to send event "${eventName}"`);
    console.warn(e);
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

function getBrowserLocale(): string | null {
  if (typeof navigator === 'undefined') {
    return null;
  }

  if (navigator.languages.length > 0) {
    return navigator.languages[0];
  }

  return navigator.language;
}

function getIsDebug(): boolean {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  if (typeof location === 'undefined') {
    return false;
  }

  return location.hostname === 'localhost';
}
