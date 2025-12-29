import 'server-only';

type CaptureProperties = Record<string, any>;

function getPostHogHost(): string | null {
  const raw = (process.env.NEXT_PUBLIC_POSTHOG_HOST || '').trim();
  if (!raw) return 'https://us.i.posthog.com';
  // If configured as a relative path (e.g. "/ingest"), it won't work from a serverless cron.
  if (raw.startsWith('/')) return 'https://us.i.posthog.com';
  return raw.replace(/\/+$/, '');
}

export async function captureServerEvent(
  event: string,
  payload: {
    distinctId: string;
    properties?: CaptureProperties;
  }
): Promise<void> {
  const apiKey = (process.env.NEXT_PUBLIC_POSTHOG_KEY || '').trim();
  const host = getPostHogHost();
  if (!apiKey || !host) return;

  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        event,
        distinct_id: payload.distinctId,
        properties: payload.properties ?? {},
      }),
    });
  } catch {
    // Best-effort only; never crash critical flows.
  }
}


