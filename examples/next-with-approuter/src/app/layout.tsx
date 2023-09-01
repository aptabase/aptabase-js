import { AptabaseProvider } from '@aptabase/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AptabaseProvider appKey="A-DEV-0000000000">{children}</AptabaseProvider>
      </body>
    </html>
  );
}
