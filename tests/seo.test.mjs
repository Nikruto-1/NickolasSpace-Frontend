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
  assert.equal((html.match(/role="tabpanel"/g) || []).length, translations.en.services.groups.length);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});

test("metadata is unique and structured data is valid JSON", () => {
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.equal((html.match(/property="og:url"/g) || []).length, 1);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.ok(schema["@graph"].some((node) => node["@type"] === "WebSite" && node.url === "https://nickolasspace.com/"));
});

test("every translated service has a matching description", () => {
  for (const [language, copy] of Object.entries(translations)) {
    assert.equal(serviceDescriptions[language].length, copy.services.groups.length);
    for (const [index, group] of copy.services.groups.entries()) {
      assert.equal(serviceDescriptions[language][index].length, group.items.length);
      assert.ok(serviceDescriptions[language][index].every((description) => description.trim().length > 0));
    }
  }
});

test("the process is readable before scroll and JavaScript", () => {
  for (const [, title, description] of translations.en.process.steps) {
    assert.ok(html.includes(escapeHtml(title)));
    assert.ok(html.includes(escapeHtml(description)));
  }
  assert.equal((html.match(/class="process-step"/g) || []).length, translations.en.process.steps.length);
});

test("social previews use the dedicated landscape cover", async () => {
  const coverUrl = "https://nickolasspace.com/assets/nickolasspace-social-v1.png";
  assert.ok(html.includes(`property="og:image" content="${coverUrl}"`));
  assert.ok(html.includes(`name="twitter:image" content="${coverUrl}"`));
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  const cover = await readFile(new URL("../dist/assets/nickolasspace-social-v1.png", import.meta.url));
  assert.equal(cover.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(cover.readUInt32BE(16), 1200);
  assert.equal(cover.readUInt32BE(20), 630);
});

test("all slider projects remain in the built HTML", () => {
  for (const [index, project] of translations.en.work.cases.entries()) {
    assert.ok(html.includes(`id="project-slide-${index}"`));
    assert.ok(html.includes(escapeHtml(project.desc)), `Missing project description: ${project.name}`);
  }
  assert.match(html, /id="project-slide-1"[^>]*hidden/);
  assert.ok(html.includes("Timed or relaxed rounds"));
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
