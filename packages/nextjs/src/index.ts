export * from '@aptabase/react';

export function init(appKey: string) {
  globalThis.__APTABASE__ = { appKey };
}
