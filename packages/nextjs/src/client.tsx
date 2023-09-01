'use client';

import { createContext, useContext } from 'react';
import { AptabaseOptions } from './types';

type TrackEventFn = (eventName: string, props?: Record<string, string | number | boolean>) => Promise<void>;

type ContextProps = {
  appKey?: string;
  client?: AptabaseClient;
} & AptabaseOptions;

export type AptabaseClient = {
  trackEvent: TrackEventFn;
};

const AptabaseContext = createContext<ContextProps>({});

type Props = {
  appKey: string;
  options?: AptabaseOptions;
  children: React.ReactNode;
};

export function AptabaseProvider({ appKey, options, children }: Props) {
  const client: AptabaseClient = {
    trackEvent: (eventName, props) => sendEvent(appKey, eventName, props),
  };

  return <AptabaseContext.Provider value={{ appKey, ...options, client }}>{children}</AptabaseContext.Provider>;
}

export function useAptabase(): AptabaseClient {
  const ctx = useContext(AptabaseContext);
  if (!ctx.client) {
    throw new Error(
      'useAptabase must be used within AptabaseProvider. Did you forget to wrap your app in <AptabaseProvider>?',
    );
  }

  return ctx.client;
}

async function sendEvent(
  appKey: string | undefined,
  eventName: string,
  props?: Record<string, string | number | boolean>,
): Promise<void> {
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
