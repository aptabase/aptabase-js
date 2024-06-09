![Aptabase](https://aptabase.com/og.png)

# Aptabase SDK for Angular Apps

A tiny SDK to instrument your Angular apps with Aptabase, an Open Source, Privacy-First and Simple Analytics for Mobile, Desktop and Web Apps.

## Setup

1. Install the SDK using npm or your preferred JavaScript package manager

```bash
npm add @aptabase/angular
```

2. Get your `App Key` from Aptabase, you can find it in the `Instructions` page.

3. Pass the `App Key` when initializing your app by importing a module or providing a function.

### Setup for Standalone API

Provide `provideAptabaseAnalytics` in the ApplicationConfig when bootstrapping.

```ts
import { provideAptabaseAnalytics } from '@aptabase/angular';

bootstrapApplication(AppComponent, {
  providers: [..., provideAptabaseAnalytics('<YOUR_APP_KEY>')],
}).catch((err) => console.error(err));
```

[Full example here](examples/example-standalone/src/app)

### Setup for NgModules

Import `AptabaseAnalyticsModule` in your root AppModule.

```ts
import { AptabaseAnalyticsModule } from '@aptabase/angular';

@NgModule({
  declarations: [AppComponent],
  imports: [..., AptabaseAnalyticsModule.forRoot('<YOUR_APP_KEY>')],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

```

[Full example here](examples/example-modules/src/app)

## Advanced setup

Both versions support also support an optional second parameter `AptabaseOptions` to pass in additional options.

```ts
export type AptabaseOptions = {
  // Custom host for self-hosted Aptabase.
  host?: string;
  // Custom path for API endpoint. Useful when using reverse proxy.
  apiUrl?: string;
  // Defines the app version.
  appVersion?: string;
  // Defines whether the app is running on debug mode.
  isDebug?: boolean;
};
```

## Tracking Events with Aptabase

After the initial setup the `AptabaseAnalyticsService` can be used to start tracking events.
Simply inject the service in a component to start tracking events:

```ts
import { AptabaseAnalyticsService } from '@aptabase/angular';

export class AppComponent {
  constructor(private _analyticsService: AptabaseAnalyticsService) {}

  increment() {
    this.counter++;
    this._analyticsService.trackEvent('increment');
  }
}
```

## A few important notes:

1. The SDK will automatically enhance the event with some useful information, like the OS and other properties.
2. You're in control of what gets sent to Aptabase. This SDK does not automatically track any events, you need to call `trackEvent` manually.
   - Because of this, it's generally recommended to at least track an event at startup
3. You do not need to subscribe to `trackEvent` function, it'll run in the background.
4. Only strings and numeric values are allowed on custom properties.
