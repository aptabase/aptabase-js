import { AptabaseOptions, getApiUrl, inMemorySessionId, sendEvent, validateAppKey } from '../shared';

// Session expires after 1 hour of inactivity
// TODO move this to shared?
const SESSION_TIMEOUT = 1 * 60 * 60;
const pkgVersion = '0.0.0'; // bog: TODO fix this version
const sdkVersion = `aptabase-angular@${pkgVersion}`;

export class AptabaseAnalyticsService {
  private _apiUrl: string | undefined;

  constructor(
    private _appKey: string,
    private _options: AptabaseOptions,
  ) {
    if (!validateAppKey(this._appKey)) return;

    this._apiUrl = this._options.apiUrl ?? getApiUrl(this._appKey, this._options);
  }

  async trackEvent(eventName: string, props?: Record<string, string | number | boolean>): Promise<void> {
    if (!this._apiUrl) return;

    const sessionId = inMemorySessionId(SESSION_TIMEOUT);

    await sendEvent({
      apiUrl: this._apiUrl,
      sessionId,
      appKey: this._appKey,
      isDebug: this._options?.isDebug,
      appVersion: this._options?.appVersion,
      sdkVersion,
      eventName,
      props,
    });
  }
}
