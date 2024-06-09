import { Component } from '@angular/core';
import { AptabaseAnalyticsService } from '@aptabase/angular';

@Component({
  selector: 'app-root',
  template: `
    <h1>Welcome to {{ title }}!</h1>

    <button (click)="trackButtonClick()">Track event</button>

    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  constructor(private _analyticsService: AptabaseAnalyticsService) {}

  title = 'example-modules';

  trackButtonClick() {
    this._analyticsService.trackEvent('module_btn_click');
  }
}
