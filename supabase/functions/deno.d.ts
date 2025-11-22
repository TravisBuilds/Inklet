// Deno type declarations for Supabase Edge Functions
declare namespace Deno {
  export namespace env {
    export function get(key: string): string | undefined;
  }
}

// Web APIs available in Deno runtime
declare const Response: typeof globalThis.Response;
declare const JSON: typeof globalThis.JSON;
declare const console: typeof globalThis.console;
declare const String: typeof globalThis.String;

