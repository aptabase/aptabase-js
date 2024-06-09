import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AptabaseAnalyticsService } from '@aptabase/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h1>Welcome to {{ title }}!</h1>

    <button (click)="trackButtonClick()">Track event</button>

    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  private _analytics = inject(AptabaseAnalyticsService);

  title = 'example-standalone';

  trackButtonClick() {
    this._analytics.trackEvent('home_btn_click', { customProp: 'Hello from Aptabase' });
  }
}
