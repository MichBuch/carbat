export function isMissingTableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('relation "vehicles" does not exist') ||
    msg.includes('relation \"vehicles\" does not exist') ||
    msg.includes('relation "batteries" does not exist')
  );
}

/** DB missing, misconfigured, or unreachable — show setup UI instead of 500 */
export function isDbUnavailable(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    isMissingTableError(err) ||
    msg.includes("DATABASE_URL missing") ||
    msg.includes("Failed query") ||
    msg.includes("fetch failed") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("ENOTFOUND") ||
    msg.includes("connect") ||
    msg.includes("timeout")
  );
}
