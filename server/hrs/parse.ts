import JSON5 from "json5";

// Feed files are JavaScript, not JSON, e.g. `var natjecanjeobjekt = { "broj": 2014, mu: 05, ... };`
// They have unquoted keys and numbers with leading zeros. We never eval them: we strip the
// assignment, drop leading zeros outside of strings, and parse the result as JSON5.

// Matches a whole string literal (kept as-is) or leading zeros of a bare number.
const STRING_OR_LEADING_ZEROS = /"(?:[^"\\]|\\.)*"|(?<![\d.\w])0+(?=\d)/g;

export function parseFeed(text: string): any {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end < start) {
    throw new Error("HRS feed: no object found in response");
  }

  const body = text
    .slice(start, end + 1)
    .replace(STRING_OR_LEADING_ZEROS, (m) => (m[0] === '"' ? m : ""));

  try {
    return JSON5.parse(body);
  } catch (error) {
    throw new Error(`HRS feed: could not parse response (${(error as Error).message})`);
  }
}
