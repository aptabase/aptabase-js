type AptabaseState = {
  appKey: string;
  apiUrl: string;
  options?: import('./types').AptabaseOptions;
};

declare var __APTABASE__: AptabaseState;
declare var __APTABASE_SDK_VERSION__: string;
