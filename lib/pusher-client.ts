import PusherClient from "pusher-js";

type PusherInstance = InstanceType<typeof PusherClient>;

// pusher-js ships different module shapes for its web/node builds, so the
// constructor can live under a few different keys depending on interop.
function resolvePusherCtor(): new (key: string, options: object) => PusherInstance {
  const candidate = PusherClient as unknown as Record<string, unknown>;
  return (candidate.default ??
    (candidate.Pusher as Record<string, unknown>)?.default ??
    candidate.Pusher ??
    PusherClient) as new (key: string, options: object) => PusherInstance;
}

let instance: PusherInstance | null = null;

function getPusherClient(): PusherInstance {
  if (instance) return instance;
  const Ctor = resolvePusherCtor();
  instance = new Ctor(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  });
  return instance;
}

// Lazy proxy: the underlying Pusher client is only constructed on first access,
// which happens inside browser-only effects. This avoids instantiating the
// browser-only library during server-side rendering.
export const pusherClient = new Proxy({} as PusherInstance, {
  get(_target, prop) {
    const client = getPusherClient();
    const value = client[prop as keyof PusherInstance];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});

export { CHANNELS, EVENTS } from "./pusher";