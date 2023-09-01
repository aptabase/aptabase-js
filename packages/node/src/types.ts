export type AptabaseOptions = {
  host?: string;
  appVersion?: string;
};

type AptabaseState = {
  appKey?: string;
  options?: AptabaseOptions;
};

declare var __APTABASE__: AptabaseState;
