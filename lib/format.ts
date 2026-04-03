// Deterministic number formatting — no locale dependency
// Always uses comma as thousands separator, period as decimal
export function fmtNum(n: number): string {
  return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function fmtMoney(n: number): string {
  return `$${fmtNum(n)}`;
}
