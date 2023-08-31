import { app, net, protocol } from "electron";
import { EnvironmentInfo, getEnvironmentInfo } from "./env";
import { newSessionId } from "./session";

export type AptabaseOptions = {
  host?: string;
};

// Session expires after 1 hour of inactivity
const SESSION_TIMEOUT = 1 * 60 * 60;
let _sessionId = newSessionId();
let _lastTouched = new Date();
let _appKey = "";
let _apiUrl = "";
let _env: EnvironmentInfo | undefined;

const _hosts: { [region: string]: string } = {
  US: "https://us.aptabase.com",
  EU: "https://eu.aptabase.com",
  DEV: "http://localhost:3000",
  SH: "",
};

export async function initialize(
  appKey: string,
  options?: AptabaseOptions
): Promise<void> {
  if (app.isReady()) {
    console.warn(
      "Aptabase: `initialize` must be invoked before the app is ready. Tracking will be disabled."
    );
    return;
  }

  const parts = appKey.split("-");
  if (parts.length !== 3 || _hosts[parts[1]] === undefined) {
    console.warn(
      `Aptabase: App Key "${appKey}" is invalid. Tracking will be disabled.`
    );
    return;
  }

  registerAptabaseProtocol();
  await app.whenReady();

  registerEventHandler();

  const baseUrl = getBaseUrl(parts[1], options);
  _apiUrl = `${baseUrl}/api/v0/event`;
  _env = await getEnvironmentInfo(app);
  _appKey = appKey;

  // some events might be emitted before the initialization is complete
  // so we drain the buffer here
  drainBuffer();
}

const buffer: {
  eventName: string;
  props?: Record<string, string | number | boolean>;
}[] = [];

export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
): Promise<void> {
  if (!_appKey || !_env) {
    buffer.push({ eventName, props });
    return Promise.resolve();
  }

  let now = new Date();
  const diffInMs = now.getTime() - _lastTouched.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  if (diffInSec > SESSION_TIMEOUT) {
    _sessionId = newSessionId();
  }
  _lastTouched = now;

  const body = {
    timestamp: now.toISOString(),
    sessionId: _sessionId,
    eventName: eventName,
    systemProps: {
      isDebug: _env.isDebug,
      locale: _env.locale,
      osName: _env.osName,
      osVersion: _env.osVersion,
      engineName: _env.engineName,
      engineVersion: _env.engineVersion,
      appVersion: _env.appVersion,
      sdkVersion: _env.sdkVersion,
    },
    props: props,
  };

  return new Promise((resolve) => {
    const onReject = (err: Error) => {
      console.error(`Aptabase: Failed to send event`, err);
      resolve();
    };

    const req = net.request({
      method: "POST",
      url: _apiUrl,
      credentials: "omit",
    });

    req.setHeader("Content-Type", "application/json");
    req.setHeader("App-Key", _appKey);

    req.on("error", onReject);
    req.on("abort", onReject);
    req.on("response", (res) => {
      if (res.statusCode >= 300) {
        console.warn(
          `Aptabase: Failed to send event "${eventName}": ${res.statusCode} ${res.statusMessage}`
        );
      }
      resolve();
    });

    req.write(JSON.stringify(body));
    req.end();
  });
}

function drainBuffer() {
  while (buffer.length > 0) {
    const data = buffer.shift();
    if (data) {
      trackEvent(data.eventName, data.props);
    }
  }
}

function registerAptabaseProtocol() {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: "aptabase-ipc",
      privileges: {
        bypassCSP: true,
        corsEnabled: true,
        supportFetchAPI: true,
        secure: true,
      },
    },
  ]);
}

function registerEventHandler() {
  protocol.registerStringProtocol("aptabase-ipc", (request, callback) => {
    try {
      const data = request.uploadData?.[0]?.bytes;
      const { eventName, props } = JSON.parse(data?.toString() ?? "{}");
      trackEvent(eventName, props);
    } catch (err) {
      console.error("Aptabase: Failed to send event", err);
    }

    callback("");
  });
}

function getBaseUrl(
  region: string,
  options?: AptabaseOptions
): string | undefined {
  if (region === "SH") {
    if (!options?.host) {
      console.warn(
        `Aptabase: Host parameter must be defined when using Self-Hosted App Key. Tracking will be disabled.`
      );
      return;
    }
    return options.host;
  }

  return _hosts[region];
}
