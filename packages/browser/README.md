![Aptabase](https://aptabase.com/og.png)

# Aptabase SDK for Browser Extensions

A tiny SDK (1 kB) to instrument your Browser/Chrome extensions with Aptabase, an Open Source, Privacy-First and Simple Analytics for Mobile, Desktop and Web Apps.

## Install

Install the SDK using npm or your preferred JavaScript package manager

```bash
npm add @aptabase/browser
```

## Usage

First you need to get your `App Key` from Aptabase, you can find it in the `Instructions` menu on the left side menu.

Initialize the SDK in your `Background Script` using your `App Key`:

```js
import { init } from '@aptabase/browser';

init('<YOUR_APP_KEY>'); // 👈 this is where you enter your App Key
```

The init function also supports an optional second parameter, which is an object with the `isDebug` property. Your data is seggregated between development and production environments, so it's important to set this value correctly. By default the SDK will use the `NODE_ENV` environment variable to determine if it's in development or production mode, which is only available in bundlers like Webpack, Rollup, etc. If you're not using a bundler, you can pass in the `isDebug` property manually.

Afterwards you can start tracking events with `trackEvent` from anywhere in your extension:

```js
import { trackEvent } from '@aptabase/browser';

trackEvent('connect_click'); // An event with no properties
trackEvent('play_music', { name: 'Here comes the sun' }); // An event with a custom property
```

A few important notes:

1. The SDK will automatically enhance the event with some useful information, like the OS, the app version, and other things.
2. You're in control of what gets sent to Aptabase. This SDK does not automatically track any events, you need to call `trackEvent` manually.
   - Because of this, it's generally recommended to at least track an event at startup
3. You do not need to await the `trackEvent` function, it'll run in the background.
4. Only strings and numeric values are allowed on custom properties
