import { inMemorySessionId, sendEvent, validateAppKey, type AptabaseOptions } from '../../shared';

// Session expires after 1 hour of inactivity
const SESSION_TIMEOUT = 1 * 60 * 60;
const sdkVersion = `aptabase-web@${process.env.PKG_VERSION}`;

let _appKey = '';
let _options: AptabaseOptions | undefined;

export { type AptabaseOptions };

export function init(appKey: string, options?: AptabaseOptions) {
  if (!validateAppKey(appKey)) return;

  _appKey = appKey;
  _options = options;
}

export async function trackEvent(eventName: string, props?: Record<string, string | number | boolean>): Promise<void> {
  const sessionId = inMemorySessionId(SESSION_TIMEOUT);

  await sendEvent({
    sessionId,
    appKey: _appKey,
    isDebug: _options?.isDebug,
    appVersion: _options?.appVersion,
    sdkVersion,
    eventName,
    props,
  });
}
