// test-utils.ts
export function normalizeQuery(query: string): string {
  return query
    .replace(/\s+/g, ' ') // Collapse multiple whitespace to single space
    .replace(/\s*\(\s*/g, '(') // Normalize spaces around parentheses
    .replace(/\s*\)\s*/g, ')')
    .replace(/\s*,\s*/g, ',') // Normalize spaces around commas
    .trim();
}