![Aptabase](https://aptabase.com/og.png)

# Aptabase SDK for Web Apps

A tiny SDK (1 kB) to instrument your web app with Aptabase, an Open Source, Privacy-First and Simple Analytics for Mobile, Desktop and Web Apps.

Building a React app? Use the `@aptabase/react` package instead.

> 👉 **IMPORTANT**
>
> This SDK is for **Web Applications**, not websites. There's a subtle, but important difference. A web app is often a lot more interactive and does not cause a full page reload when the user interacts with it. It's often called a **Single-Page Application**. A website, on the other hand, is a lot more content-focused like marketing sites, landing pages, blogs, etc. While you can certainly use Aptabase to track events on websites, please be aware that each page reload will be considered a new session.

## Install

Install the SDK using npm or your preferred JavaScript package manager

```bash
npm add @aptabase/web
```

## Usage

First you need to get your `App Key` from Aptabase, you can find it in the `Instructions` menu on the left side menu.

Initialize the SDK using your `App Key`:

```js
import { init } from '@aptabase/web';

init('<YOUR_APP_KEY>'); // 👈 this is where you enter your App Key
```

The init function also supports an optional second parameter, which is an object with the `appVersion` property.

It's up to you to decide how to get the version of your app, but it's generally recommended to use your bundler (like Webpack, Vite, Rollup, etc.) to inject the values at build time. Alternatively you can also pass it in manually.

Afterwards you can start tracking events with `trackEvent`:

```js
import { trackEvent } from '@aptabase/web';

trackEvent('connect_click'); // An event with no properties
trackEvent('play_music', { name: 'Here comes the sun' }); // An event with a custom property
```

A few important notes:

1. The SDK will automatically enhance the event with some useful information, like the OS and other properties.
2. You're in control of what gets sent to Aptabase. This SDK does not automatically track any events, you need to call `trackEvent` manually.
   - Because of this, it's generally recommended to at least track an event at startup
3. You do not need to await the `trackEvent` function, it'll run in the background.
4. Only strings and numeric values are allowed on custom properties
