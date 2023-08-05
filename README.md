![Aptabase](https://aptabase.com/og.png)

# JavaScript SDK for Aptabase

A tiny SDK (1 kB) to instrument your web app with Aptabase, an Open Source, Privacy-First, and Simple Analytics for Mobile, Desktop, and Web Apps.

> 👉 **IMPORTANT**
>
> This SDK is for **Web Applications**, not websites. There's a subtle, but important difference. A web app is often a lot more interactive and does not cause a full page to reload when the user interacts with it. It's often called a **Single-Page Application**. A website, on the other hand, is a lot more content-focused like marketing sites, landing pages, blogs, etc. While you can certainly use Aptabase to track events on websites, please be aware that each page reloads will be considered a new session.

## Install

Install the SDK using your preferred JavaScript package manager

```bash
npm add @aptabase/web
```

## Usage

First, you need to get your `App Key` from Aptabase, you can find it in the `Instructions` menu on the left side menu.

Initialized the SDK using your `App Key`:

```js
import { init } from "@aptabase/web";

init("<YOUR_APP_KEY>"); // 👈 this is where you enter your App Key
```

The init function also supports an optional second parameter, which is an object with the `appVersion` property.

It's up to you to decide what to get the version of your app, but it's generally recommended to use your bundler (like Webpack, Vite, Rollup, etc.) to inject the values at build time.

Afterward, you can start tracking events with `trackEvent`:

```js
import { trackEvent } from "@aptabase/web";

trackEvent("app_started"); // An event with no properties
trackEvent("page_view", { name: "Settings", path: "/settings" }); // An event with a custom property
```

A few important notes:

1. The SDK will automatically enhance the event with some useful information, like the OS, the app version, and other things.
2. You're in control of what gets sent to Aptabase. This SDK does not automatically track any events, you need to call `trackEvent` manually.
   - Because of this, it's generally recommended to at least track an event at startup
3. You do not need to await for the `trackEvent` function, it'll run in the background.
4. Only strings and numbers values are allowed on custom properties
