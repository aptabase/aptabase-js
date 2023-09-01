import { AptabaseProvider } from '@aptabase/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AptabaseProvider appKey="A-US-5431775171">{children}</AptabaseProvider>
      </body>
    </html>
  );
}
