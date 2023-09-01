import { trackEvent as nodeTrackEvent } from '@aptabase/node';
import { type NextIncomingMessage } from 'next/dist/server/request-meta';
import { headers } from 'next/headers';

export { init } from '@aptabase/node';

export async function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>,
  req?: NextIncomingMessage,
): Promise<void> {
  const headers = getHeaders(req);
  if (!headers) return Promise.resolve();

  return nodeTrackEvent({ headers }, eventName, props);
}

function getHeaders(req?: NextIncomingMessage): Headers | undefined {
  if (req) {
    // we only need the user-agent header
    return new Headers({
      'user-agent': req.headers['user-agent'] ?? '',
    });
  }

  // headers() might throw an error if called outside of a request context.
  try {
    return headers();
  } catch {}

  // If we're here, the app is probably using the Pages Router and the developer forgot to pass the req parameter.
  if (!req) {
    console.warn("Aptabase: The 'req' parameter of trackEvent is required when using Pages Router.");
  }

  return undefined;
}
