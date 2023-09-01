"use client";

import { init, trackEvent, type AptabaseOptions } from "@aptabase/web";
import { createContext, useContext, useEffect } from "react";

globalThis.__APTABASE_SDK_VERSION__ = `aptabase-react@${process.env.PKG_VERSION}`;

type ContextProps = {
  appKey?: string;
  options?: AptabaseOptions;
};

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

  return (
    <AptabaseContext.Provider value={{ appKey, options }}>
      {children}
    </AptabaseContext.Provider>
  );
}

export function useAptabase(): AptabaseClient {
  const ctx = useContext(AptabaseContext);
  if (!ctx.appKey) {
    console.error(
      "Aptabase: useAptabase must be used within AptabaseProvider. Did you forget to wrap your app in <AptabaseProvider>?"
    );
    return { trackEvent: () => Promise.resolve() };
  }

  return { trackEvent };
}
