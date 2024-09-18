'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getApiUrl, inMemorySessionId, sendEvent, validateAppKey, type AptabaseOptions } from '../../shared';

// Session expires after 1 hour of inactivity
const SESSION_TIMEOUT = 1 * 60 * 60;
const sdkVersion = `aptabase-react@${process.env.PKG_VERSION}`;

let _appKey = '';
let _apiUrl: string | undefined;
let _options: AptabaseOptions | undefined;
let _eventsBeforeInit: { [key: string]: Record<string, string | number | boolean> | undefined } = {};

type ContextProps = {
  appKey?: string;
  options?: AptabaseOptions;
  isInitialized: boolean;
};

function init(appKey: string, options?: AptabaseOptions) {
  if (!validateAppKey(appKey)) return;

  _apiUrl = options?.apiUrl ?? getApiUrl(appKey, options);
  _appKey = appKey;
  _options = options;

  Object.keys(_eventsBeforeInit).forEach((eventName) => {
    trackEvent(eventName, _eventsBeforeInit[eventName]);
  });
  _eventsBeforeInit = {};
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

function trackEventBeforeInit(eventName: string, props?: Record<string, string | number | boolean>): Promise<void> {
  _eventsBeforeInit[eventName] = props;
  return Promise.resolve();
}

const AptabaseContext = createContext<ContextProps>({ isInitialized: false });

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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    init(appKey, options);
    setIsInitialized(true);
  }, [appKey, options]);

  return <AptabaseContext.Provider value={{ appKey, options, isInitialized }}>{children}</AptabaseContext.Provider>;
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

  if (!ctx.isInitialized) {
    return {
      trackEvent: trackEventBeforeInit,
    };
  }

  return {
    trackEvent,
  };
}
