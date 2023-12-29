import { getApiUrl, inMemorySessionId, sendEvent, validateAppKey, type AptabaseOptions } from '../../shared';

// Session expires after 1 hour of inactivity
const SESSION_TIMEOUT = 1 * 60 * 60;
const sdkVersion = `aptabase-web@${process.env.PKG_VERSION}`;

let _appKey = '';
let _apiUrl: string | undefined;
let _options: AptabaseOptions | undefined;

export { type AptabaseOptions };

export function init(appKey: string, options?: AptabaseOptions) {
  if (!validateAppKey(appKey)) return;

  _apiUrl = options?.apiUrl ?? getApiUrl(appKey, options);
  _appKey = appKey;
  _options = options;
}

export async function trackEvent(eventName: string, props?: Record<string, string | number | boolean>): Promise<void> {
  if (!_apiUrl) return;

  const sessionId = inMemorySessionId(SESSION_TIMEOUT);

  await sendEvent({
    apiUrl: _apiUrl,
    sessionId,
    appKey: _appKey,
    isDebug: _options?.isDebug,
    appVersion: _options?.appVersion,
    sdkVersion,
    eventName,
    props,
  });
}
