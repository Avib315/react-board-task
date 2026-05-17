import en from './en.json';

// Typed translations object — access with t.nav.brand, t.board.title etc.
export const t = en;

// Simple interpolation: interp(t.board.subtitle, { total: 20, columns: 4 })
// replaces {total} and {columns} with their values
export function interp(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (str, [key, val]) => str.replaceAll(`{${key}}`, String(val)),
    template,
  );
}
