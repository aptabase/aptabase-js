'use client';

import { init, trackEvent, type AptabaseOptions } from '@aptabase/web';
import { createContext, useContext, useEffect } from 'react';

type ContextProps = {
  appKey?: string;
} & AptabaseOptions;

export type AptabaseClient = {
  trackEvent: typeof trackEvent;
};

const AptabaseContext = createContext<ContextProps>({});

type Props = {
  appKey: string;
  options?: AptabaseOptions;
  children: React.ReactNode;
};

export function AptabaseProvider({ appKey, options, children }: Props) {
  useEffect(() => {
    init(appKey, options);
  }, [appKey, options]);

  return <AptabaseContext.Provider value={{ appKey, ...options }}>{children}</AptabaseContext.Provider>;
}

export function useAptabase(): AptabaseClient {
  const ctx = useContext(AptabaseContext);
  if (!ctx) {
    throw new Error(
      'useAptabase must be used within AptabaseProvider. Did you forget to wrap your app in <AptabaseProvider>?',
    );
  }

  return { trackEvent };
}
