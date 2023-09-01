import { AptabaseProvider } from '@aptabase/nextjs/client';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AptabaseProvider appKey="A-US-5431775171">{children}</AptabaseProvider>
      </body>
    </html>
  );
}
