import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { URL } from "node:url";
import { translations } from "../src/i18n/translations.js";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const theme = await read("public/theme.css");
const tokens = Object.fromEntries([...theme.matchAll(/--([\w-]+)-rgb:\s*(\d+) (\d+) (\d+)/g)].map(([, key, ...rgb]) => [key, rgb.map(Number)]));
const luminance = (rgb) => rgb.map((value) => {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
const contrast = (first, second) => {
  const values = [luminance(tokens[first]), luminance(tokens[second])].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

test("palette text pairs meet WCAG AA normal-text contrast", () => {
  for (const [foreground, background] of [["paper", "ink"], ["paper", "ink2"], ["mist", "ink"], ["mist", "ink2"], ["accent", "ink"], ["accent", "ink2"], ["ink", "accent"], ["ink", "accent-hover"], ["muted-dark", "paper"]]) {
    const ratio = contrast(foreground, background);
    assert.ok(ratio >= 4.5, `${foreground}/${background}: ${ratio.toFixed(2)}`);
  }
});

test("control boundaries have at least 3:1 contrast", () => {
  for (const background of ["ink", "ink2"]) assert.ok(contrast("control", background) >= 3);
});

test("production CSP limits scripts and hashes every inline script", async () => {
  for (const name of ["index.html", "privacy.html", "privacy-uk.html", "privacy-sv.html", "404.html"]) {
    const html = await read(`dist/${name}`);
    const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
    const scriptRule = policy.split(";").find((rule) => rule.trim().startsWith("script-src "));
    assert.doesNotMatch(scriptRule, /unsafe-inline|unsafe-eval|https:|\*/);
    for (const [, content] of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
      const hash = createHash("sha256").update(content).digest("base64");
      assert.ok(policy.includes(`'sha256-${hash}'`));
    }
    for (const directive of ["object-src 'none'", "base-uri 'none'", "form-action 'none'", "font-src 'self'", "script-src-attr 'none'"]) assert.ok(policy.includes(directive));
    assert.match(html, /name="referrer" content="no-referrer"/);
  }
});

test("local fonts replace Google requests and include their licence", async () => {
  const css = await read("src/styles/global.css");
  assert.doesNotMatch(css, /fonts\.googleapis|fonts\.gstatic/);
  assert.match(css, /font-display: swap/);
  for (const name of ["bricolage-latin.woff2", "bricolage-latin-ext.woff2"]) {
    assert.ok((await stat(new URL(`../dist/assets/fonts/${name}`, import.meta.url))).size > 1000);
  }
  assert.match(await read("public/assets/fonts/OFL.txt"), /SIL OPEN FONT LICENSE/);
});

test("translated privacy pages are real, cross-linked and in the sitemap", async () => {
  const sitemap = await read("dist/sitemap.xml");
  for (const [language, translation] of Object.entries(translations)) {
    const filename = translation.footer.privacyUrl.replace("./", "");
    const html = await read(`dist/${filename}`);
    assert.ok(html.includes(`<html lang="${language}">`));
    assert.ok(html.includes(`href="https://nickolasspace.com/${filename}"`));
    assert.ok(sitemap.includes(`https://nickolasspace.com/${filename}`));
    assert.ok(html.includes("kkosmacevskij@gmail.com"));
    assert.ok(html.includes('id="clear-language"'));
  }
  assert.doesNotMatch(await read("dist/index.html"), /hreflang=/);
});

test("published images reserve their size and links protect new tabs", async () => {
  const html = await read("dist/index.html");
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(tag, /\bwidth="\d+"/);
    assert.match(tag, /\bheight="\d+"/);
    assert.match(tag, /\balt=/);
  }
  for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(tag, /rel="[^"]*(noreferrer|noopener)/);
  assert.match(html, /id="main-content"/);
  assert.match(html, /href="#main-content"/);
  assert.match(html, /srcSet=|srcset=/);
});
