![Aptabase](https://aptabase.com/og.png)

# React SDK for Aptabase

A tiny SDK (1 kB) to instrument your React apps with Aptabase, an Open Source, Privacy-First and Simple Analytics for Mobile, Desktop and Web Apps.

## Setup

1. Install the SDK using your preferred JavaScript package manager

```bash
npm add @aptabase/react
```

2. Get your `App Key` from Aptabase, you can find it in the `Instructions` menu on the left side menu.

3. Initialize the `AptabaseProvider` component to your app based on your framework.

<details>
  <summary>Setup for Next.js (App Router)</summary>
  
  Add `AptabaseProvider` to your RootLayout component:

```tsx
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
```

</details>

<details>
  <summary>Setup for Next.js (Pages Router)</summary>

Add `AptabaseProvider` to your `_app` component:

```tsx
import { AptabaseProvider } from '@aptabase/react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AptabaseProvider appKey="A-DEV-0000000000">
      <Component {...pageProps} />
    </AptabaseProvider>
  );
}
```

</details>

<details>
  <summary>Setup for Remix</summary>

Add `AptabaseProvider` to your `entry.client.tsx` file:

```tsx
import { AptabaseProvider } from '@aptabase/react';
import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <AptabaseProvider appKey="A-DEV-0000000000">
        <RemixBrowser />
      </AptabaseProvider>
    </StrictMode>,
  );
});
```

</details>

<details>
  <summary>Setup for Create React App or Vite</summary>

Add `AptabaseProvider` to your root component:

```tsx
import { AptabaseProvider } from '@aptabase/react';

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AptabaseProvider appKey="<YOUR_APP_KEY>">
      <YourApp />
    </AptabaseProvider>
  </React.StrictMode>,
);
```

</details>

## Advanced setup

The `AptabaseProvider` also supports an optional second parameter, which is an object with the `appVersion` property.

It's up to you to decide what to get the version of your app, but it's generally recommended to use your bundler (like Webpack, Vite, Rollup, etc.) to inject the values at build time.

## Tracking Events with Aptabase

After setting up the `AptabaseProvider`, you can then start tracking events using the `useAptabase` hook.

Here's an example of a simple counter component that tracks the `increment` and `decrement` events:

```js
'use client';

import { useState } from 'react';
import { useAptabase } from '@aptabase/react';

export function Counter() {
  const { trackEvent } = useAptabase();
  const [count, setCount] = useState(0);

  function increment() {
    setCount((c) => c + 1);
    trackEvent('increment', { count });
  }

  function decrement() {
    setCount((c) => c - 1);
    trackEvent('decrement', { count });
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
```

A few important notes:

1. The SDK will automatically enhance the event with some useful information, like the OS, the app version, and other things.
2. You're in control of what gets sent to Aptabase. This SDK does not automatically track any events, you need to call `trackEvent` manually.
   - Because of this, it's generally recommended to at least track an event at startup
3. You do not need to await the `trackEvent` function, it'll run in the background.
4. Only strings and numeric values are allowed on custom properties
