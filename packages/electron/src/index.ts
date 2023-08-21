export async function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") {
    console.error(
      "Aptabase: to track events in the main process you must import 'trackEvent' from '@aptabase/electron/main'."
    );
    return;
  }

  try {
    await fetch("aptabase-ipc://trackEvent", {
      method: "POST",
      body: JSON.stringify({ eventName, props }),
    });
  } catch (err) {
    console.error("Aptabase: Failed to send event", err);
  }
}
