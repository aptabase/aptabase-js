import { EnvironmentProviders, NgModule, makeEnvironmentProviders } from '@angular/core';

import { AptabaseOptions } from '../shared';
import { AptabaseAnalyticsService } from './analytics.service';

export function provideAptabaseAnalytics(appKey: string, options: AptabaseOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: AptabaseAnalyticsService,
      useValue: new AptabaseAnalyticsService(appKey, options),
    },
  ]);
}

@NgModule()
export class AptabaseAnalyticsModule {
  static forRoot(appKey: string, options: AptabaseOptions = {}) {
    return {
      ngModule: AptabaseAnalyticsModule,
      providers: [
        {
          provide: AptabaseAnalyticsService,
          useValue: new AptabaseAnalyticsService(appKey, options),
        },
      ],
    };
  }
}
