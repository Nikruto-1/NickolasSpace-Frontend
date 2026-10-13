import { createHash } from "node:crypto";

export function withSecurityPolicy(html) {
  const hashes = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => `'sha256-${createHash("sha256").update(match[1]).digest("base64")}'`);
  // Inline styles support React animation values and the no-JavaScript fallback.
  const policy = `default-src 'self'; script-src 'self' ${hashes.join(" ")}; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-src 'none'; worker-src 'none'; form-action 'none'`;
  return html.replace(/<meta charset="UTF-8"\s*\/>/, (charset) => `${charset}\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`);
}
