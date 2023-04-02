import { newSessionId } from "./session";

// env.PKG_VERSION is replaced by rollup during build phase
const sdkVersion = "aptabase-web@env.PKG_VERSION";

export type AptabaseOptions = {
  appVersion?: string;
};

let _appKey = "";
let _locale = "";
let _apiUrl = "";
let _sessionId = newSessionId();
let _options: AptabaseOptions | undefined;

const regions: { [region: string]: string } = {
  US: "https://api-us.aptabase.com",
  EU: "https://api-eu.aptabase.com",
  DEV: "http://localhost:5251",
};

export function init(appKey: string, options?: AptabaseOptions) {
  _appKey = appKey;
  _options = options;

  const parts = appKey.split("-");
  if (parts.length !== 3) {
    console.warn(
      `The Aptabase App Key "${appKey}" is invalid. Tracking will be disabled.`
    );
    return;
  }

  const region = parts[1];
  const baseUrl = regions[region] ?? regions.DEV;
  _apiUrl = `${baseUrl}/v0/event`;

  _locale =
    navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language;
}

export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
) {
  if (!_appKey || !window || !window.fetch) return;

  const body = JSON.stringify({
    timestamp: new Date().toISOString(),
    sessionId: _sessionId,
    eventName: eventName,
    systemProps: {
      locale: _locale,
      appVersion: _options?.appVersion ?? "",
      sdkVersion,
    },
    props: props,
  });

  window
    .fetch(_apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "App-Key": _appKey,
      },
      credentials: "omit",
      body,
    })
    .then((response) => {
      if (response.status >= 300) {
        console.warn(
          `Failed to send event "${eventName}": ${response.status} ${response.statusText}`
        );
      }
    })
    .catch(console.error);
}
