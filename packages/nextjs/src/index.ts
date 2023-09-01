export * from './client';

export function init(appKey: string) {
  globalThis.__APTABASE__ = { appKey };
}
