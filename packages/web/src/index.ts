// env.PKG_VERSION is replaced by rollup during build phase
const sdkVersion = `aptabase-web@${process.env.PKG_VERSION}`;

export type AptabaseOptions = {
  host?: string;
  appVersion?: string;
};

let _appKey = '';
let _apiUrl = '';
let _locale = '';
let _isDebug = false;
let _options: AptabaseOptions | undefined;

const _hosts: { [region: string]: string } = {
  US: 'https://us.aptabase.com',
  EU: 'https://eu.aptabase.com',
  DEV: 'http://localhost:3000',
  SH: '',
};

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

export function init(appKey: string, options?: AptabaseOptions) {
  _appKey = appKey;
  _options = options;

  const parts = appKey.split('-');
  if (parts.length !== 3 || _hosts[parts[1]] === undefined) {
    console.warn(`The Aptabase App Key "${appKey}" is invalid. Tracking will be disabled.`);
    return;
  }

  const baseUrl = getBaseUrl(parts[1], options);
  _apiUrl = `${baseUrl}/api/v0/event`;

  if (typeof location !== 'undefined') {
    _isDebug = location.hostname === 'localhost';
  }

  if (typeof navigator !== 'undefined') {
    _locale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
  }
}

export function trackEvent(eventName: string, props?: Record<string, string | number | boolean>) {
  if (!_appKey || typeof window === 'undefined' || !window.fetch) return;

  const body = JSON.stringify({
    timestamp: new Date().toISOString(),
    sessionId: 'CHANGE-THIS',
    eventName: eventName,
    systemProps: {
      isDebug: _isDebug,
      locale: _locale,
      appVersion: _options?.appVersion ?? '',
      sdkVersion,
    },
    props: props,
  });

  window
    .fetch(_apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'App-Key': _appKey,
      },
      credentials: 'omit',
      body,
    })
    .then((response) => {
      if (response.status >= 300) {
        console.warn(`Failed to send event "${eventName}": ${response.status} ${response.statusText}`);
      }
    })
    .catch(console.error);
}
