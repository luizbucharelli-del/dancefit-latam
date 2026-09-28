// Only the deadline is persisted; quiz answers stay in sessionStorage.
export function resolveDeadline({ stores, key, now, durationMs, remembered = null }) {
  const known = Number.isFinite(remembered) ? [remembered] : [];
  for (const storage of stores) {
    try { const raw = storage?.getItem(key); const value = Number(raw); if (raw !== null && raw !== undefined && Number.isFinite(value) && value > 0) known.push(value); } catch {}
  }
  const deadline = known.length ? Math.min(...known) : now + durationMs;
  let retained = false;
  for (const storage of stores) {
    try { storage?.setItem(key, String(deadline)); if (storage?.getItem(key) === String(deadline)) retained = true; } catch {}
  }
  return retained || known.length ? deadline : null;
}

export function remainingSeconds(deadline, now = Date.now()) {
  return Number.isFinite(deadline) ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0;
}
