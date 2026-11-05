![Aptabase](https://aptabase.com/og.png)

# Aptabase SDK for React Apps

A tiny SDK (1 kB) to instrument your React apps with Aptabase, an Open Source, Privacy-First and Simple Analytics for Mobile, Desktop and Web Apps.

## Setup

1. Install the SDK using npm or your preferred JavaScript package manager

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
        <AptabaseProvider appKey="<YOUR_APP_KEY>">{children}</AptabaseProvider>
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
    <AptabaseProvider appKey="<YOUR_APP_KEY>">
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
      <AptabaseProvider appKey="<YOUR_APP_KEY>">
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

The `AptabaseProvider` also accepts an optional `options` prop, which supports the `appVersion`, `isDebug`, `host` and `apiUrl` properties.

It's up to you to decide how to get the version of your app, but it's generally recommended to use your bundler (like Webpack, Vite, Rollup, etc.) to inject the values at build time. Alternatively you can also pass it in manually.

```tsx
// Define options outside of the component so the object isn't recreated on every render
const aptabaseOptions = { appVersion: '1.0.0' };

<AptabaseProvider appKey="<YOUR_APP_KEY>" options={aptabaseOptions}>
  <YourApp />
</AptabaseProvider>
```

## Send your first event

After setting up the `AptabaseProvider`, use the `useAptabase` hook to get `trackEvent` and call it from an event handler.

Here's a complete client component with a button that sends a test event:

```tsx
'use client';

import { useAptabase } from '@aptabase/react';

export function TestEventButton() {
  const { trackEvent } = useAptabase();

  function handleClick() {
    trackEvent('test_event', { source: 'quickstart' });
  }

  return <button onClick={handleClick}>Send test event</button>;
}
```

Render `<TestEventButton />` anywhere inside `AptabaseProvider`, start your app locally (e.g. `npm run dev`) and click the button.

### Confirm the event in the dashboard

1. Open your app in the Aptabase dashboard ([us.aptabase.com](https://us.aptabase.com) or [eu.aptabase.com](https://eu.aptabase.com), depending on your App Key region).
2. Select the **Debug** build mode using the Bug/Rocket icon at the top right, next to the date picker. Events sent while running on `localhost` or with `NODE_ENV=development` are recorded as **Debug**; production builds are recorded as **Release**. An orange ribbon at the top of the screen means you're looking at Debug data. See [Build Modes](https://aptabase.com/docs/build-modes) for details.
3. Open **Live View** from the left menu. Your `test_event` shows up within a few seconds.

If nothing shows up, check the browser console for `Aptabase:` warnings (e.g. an invalid App Key or a component rendered outside `AptabaseProvider`).

## Tracking Events with Aptabase

Once your first event shows up, track the user actions you care about the same way. Here's an example of a simple counter component that tracks the `increment` and `decrement` events:

```tsx
'use client';

import { useState } from 'react';
import { useAptabase } from '@aptabase/react';

export function Counter() {
  const { trackEvent } = useAptabase();
  const [count, setCount] = useState(0);

  function increment() {
    const next = count + 1;
    setCount(next);
    trackEvent('increment', { count: next });
  }

  function decrement() {
    const next = count - 1;
    setCount(next);
    trackEvent('decrement', { count: next });
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

## Where to call `trackEvent`

Track **user actions**, not rendering. Call `trackEvent` from event handlers like `onClick`, `onSubmit` or `onChange`, never directly in the component body or inside `useEffect`.

React may render a component many times for reasons that have nothing to do with the user (state updates, parent re-renders, Strict Mode running renders and effects twice in development). An event tracked from render logic counts those re-renders as user activity and inflates your numbers.

```tsx
// ❌ Don't: runs on every render
function Settings() {
  const { trackEvent } = useAptabase();
  trackEvent('settings_viewed');
  // ...
}

// ✅ Do: runs once per user action
function Settings() {
  const { trackEvent } = useAptabase();

  function handleSave() {
    trackEvent('settings_saved', { theme: 'dark' });
  }

  return <button onClick={handleSave}>Save</button>;
}
```

A few important notes:

1. The SDK will automatically enhance the event with some useful information, like the OS and other properties.
2. You're in control of what gets sent to Aptabase. This SDK does not automatically track any events, you need to call `trackEvent` manually.
3. You do not need to await the `trackEvent` function, it'll run in the background.
4. Only strings, numbers and booleans are allowed on custom properties.
