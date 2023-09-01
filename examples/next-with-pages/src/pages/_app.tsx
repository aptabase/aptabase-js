import { AptabaseProvider } from '@aptabase/nextjs/client';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AptabaseProvider appKey="A-DEV-0000000000">
      <Component {...pageProps} />
    </AptabaseProvider>
  );
}
