import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { URL } from "node:url";
import { translations } from "../src/i18n/translations.js";
import { serviceDescriptions } from "../src/i18n/serviceDescriptions.js";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;",
})[character]);

test("built HTML contains every service before JavaScript runs", () => {
  assert.match(html, /data-prerendered="true"/);
  for (const [groupIndex, group] of translations.en.services.groups.entries()) {
    for (const [index, name] of group.items.entries()) {
      assert.ok(html.includes(escapeHtml(name)), `Missing service: ${name}`);
      assert.ok(html.includes(escapeHtml(serviceDescriptions.en[groupIndex][index])), `Missing description: ${name}`);
    }
  }
  assert.equal((html.match(/role="tabpanel"/g) || []).length, 5);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});

test("metadata is unique and structured data is valid JSON", () => {
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.equal((html.match(/property="og:url"/g) || []).length, 1);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.ok(schema["@graph"].some((node) => node["@type"] === "WebSite" && node.url === "https://nickolasspace.com/"));
});

test("the initial HTML does not request decorative videos", () => {
  for (const video of html.matchAll(/<video\b[^>]*>/g)) {
    assert.doesNotMatch(video[0], /\bsrc=/);
    assert.match(video[0], /preload="none"/);
  }
});

test("privacy link has a real static page and appears in the sitemap", async () => {
  assert.match(html, /href="\.\/privacy\.html"/);
  const privacy = await readFile(new URL("../dist/privacy.html", import.meta.url), "utf8");
  assert.match(privacy, /<h1>Privacy &amp; site data<\/h1>|<h1>Privacy & site data<\/h1>/);
  const sitemap = await readFile(new URL("../dist/sitemap.xml", import.meta.url), "utf8");
  assert.ok(sitemap.includes("https://nickolasspace.com/privacy.html"));
});
