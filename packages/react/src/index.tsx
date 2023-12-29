'use client';

import { createContext, useContext, useEffect } from 'react';
import { getApiUrl, inMemorySessionId, sendEvent, validateAppKey, type AptabaseOptions } from '../../shared';

// Session expires after 1 hour of inactivity
const SESSION_TIMEOUT = 1 * 60 * 60;
const sdkVersion = `aptabase-react@${process.env.PKG_VERSION}`;

let _appKey = '';
let _apiUrl: string | undefined;
let _options: AptabaseOptions | undefined;

type ContextProps = {
  appKey?: string;
  options?: AptabaseOptions;
};

function init(appKey: string, options?: AptabaseOptions) {
  if (!validateAppKey(appKey)) return;

  _apiUrl = getApiUrl(appKey, options);
  _appKey = appKey;
  _options = options;
}

async function trackEvent(eventName: string, props?: Record<string, string | number | boolean>): Promise<void> {
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

const AptabaseContext = createContext<ContextProps>({});

type Props = {
  appKey: string;
  options?: AptabaseOptions;
  children: React.ReactNode;
};

export { type AptabaseOptions };

export type AptabaseClient = {
  trackEvent: typeof trackEvent;
};

export function AptabaseProvider({ appKey, options, children }: Props) {
  useEffect(() => {
    init(appKey, options);
  }, [appKey, options]);

  return <AptabaseContext.Provider value={{ appKey, options }}>{children}</AptabaseContext.Provider>;
}

export function useAptabase(): AptabaseClient {
  const ctx = useContext(AptabaseContext);

  if (!ctx.appKey) {
    return {
      trackEvent: () => {
        console.warn(
          `Aptabase: useAptabase must be used within AptabaseProvider. Did you forget to wrap your app in <AptabaseProvider>?`,
        );
        return Promise.resolve();
      },
    };
  }

  return {
    trackEvent,
  };
}
