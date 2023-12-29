import { getApiUrl, newSessionId, sendEvent, validateAppKey, type AptabaseOptions } from '../../shared';

// Session expires after 1 hour of inactivity
const SESSION_TIMEOUT = 1 * 60 * 60;
const sdkVersion = `aptabase-browser@${process.env.PKG_VERSION}`;
const isWebContext = 'document' in globalThis;

let _appKey = '';
let _apiUrl: string | undefined;
let _options: AptabaseOptions | undefined;

globalThis.aptabase = {
  init,
  trackEvent,
};

export async function init(appKey: string, options?: AptabaseOptions): Promise<void> {
  if (isWebContext) {
    console.error('@aptabase/browser can only be initialized in your background script.');
    return;
  }

  if (!validateAppKey(appKey)) return;

  const ext = await chrome.management.getSelf();

  const isDebug = options?.isDebug ?? ext.installType === 'development';
  const appVersion = options?.appVersion ?? chrome.runtime.getManifest().version;

  _apiUrl = options?.apiUrl ?? getApiUrl(appKey, options);
  _appKey = appKey;
  _options = { ...options, isDebug, appVersion };

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type === '__aptabase__trackEvent') {
      trackEvent(message.eventName, message.props);
    }
  });
}

export async function trackEvent(eventName: string, props?: Record<string, string | number | boolean>): Promise<void> {
  if (isWebContext) {
    return chrome.runtime.sendMessage({ type: '__aptabase__trackEvent', eventName, props });
  }

  if (!_apiUrl) return;
  const sessionId = await getSessionId();

  return sendEvent({
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

type CachedItem = {
  id: string;
  lastTouched: number;
};

let _sessionId = newSessionId();

async function getSessionId(): Promise<string> {
  const now = Date.now();

  // If storage is not available, return the in memory session id
  // This id will be recreated if the extension is reloaded or the service worker becomes inactive
  if (!chrome?.storage?.local) return _sessionId;

  return new Promise((resolve) => {
    chrome.storage.local.get('_ab_session_id', (result) => {
      let item = (result['_ab_session_id'] as CachedItem) ?? { id: _sessionId, lastTouched: Date.now() };

      const diffInMs = now - item.lastTouched;
      const diffInSec = Math.floor(diffInMs / 1000);
      if (diffInSec > SESSION_TIMEOUT) {
        item.id = newSessionId();
      }
      item.lastTouched = now;

      chrome.storage.local.set({ _ab_session_id: item }, () => {
        resolve(item.id);
      });
    });
  });
}
