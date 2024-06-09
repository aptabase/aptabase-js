import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAptabaseAnalytics } from '@aptabase/angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAptabaseAnalytics('A-DEV-1624170742')],
};
