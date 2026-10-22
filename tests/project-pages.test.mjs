import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { URL } from "node:url";
import { projectFilename, projectRoute, projectLanguages, projectSlugs } from "../src/data/projectRoutes.js";
import { projectMetadata } from "../src/data/projectMetadata.js";
import { caseStudies } from "../src/i18n/caseStudies.js";
import { projectPages } from "../src/i18n/projectPages.js";
import { normalizePortfolioState, isPlainNavigation, openProject, switchProjectLanguage } from "../src/navigation/portfolioState.js";

const read = (path) => readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");
const escape = (value) => value.replace(/&/g, "&amp;").replace(/'/g, "&#x27;").replace(/"/g, "&quot;");

test("only real case routes resolve, with a distinct URL for each language", () => {
  for (const [index, slug] of projectSlugs.entries()) {
    for (const language of projectLanguages) assert.deepEqual(projectRoute(`/${projectFilename(slug, language)}`), { index, slug, language });
  }
  assert.equal(projectRoute("/project-made-up.html"), null);
  assert.equal(projectRoute("/"), null);
});

test("all six case pages contain translated content, metadata and safe scripts before JS", async () => {
  const sitemap = await read("sitemap.xml");
  for (const [index, slug] of projectSlugs.entries()) {
    for (const language of projectLanguages) {
      const metadata = projectMetadata({ index, slug, language });
      const html = await read(projectFilename(slug, language));
      assert.ok(html.includes(`<html lang="${language}">`));
      assert.match(html, /data-prerendered="true"/);
      assert.equal((html.match(/<h1\b/g) || []).length, 1);
      assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
      assert.ok(html.includes(`rel="canonical" href="${metadata.url}"`));
      assert.ok(sitemap.includes(metadata.url));
      for (const alternate of metadata.alternates) {
        assert.ok(html.includes(`hreflang="${alternate.language}" href="${alternate.url}"`));
      }
      for (const paragraph of caseStudies[language].projects[metadata.project.name]) assert.ok(html.includes(escape(paragraph)));
      assert.ok(html.includes(escape(projectPages[language].back)));
      assert.ok(html.includes(`href="./?project=${slug}#work"`));
      assert.ok(html.includes(`property="og:image" content="${metadata.image}"`));
      const image = new URL(metadata.image).pathname.slice(1);
      assert.ok((await stat(new URL(`../dist/${image}`, import.meta.url))).size > 0);
      const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
      assert.ok(schema["@graph"].some((node) => node["@type"] === "WebPage" && node.url === metadata.url && node.inLanguage === language));
      const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
      for (const [, script] of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
        assert.ok(policy.includes(createHash("sha256").update(script).digest("base64")));
      }
      assert.doesNotMatch(html, /<video\b/);
    }
  }
});

test("game and mode details remain collapsed but present in every case language", async () => {
  for (const language of projectLanguages) {
    const html = await read(projectFilename("nickolasgames", language));
    assert.match(html, /<details\b/);
    assert.doesNotMatch(html, /<details[^>]*\bopen(?:=|\s|>)/);
    assert.ok(html.includes("Alias"));
  }
});

test("portfolio restoration accepts only valid projects and gallery indices", () => {
  assert.deepEqual(normalizePortfolioState({ active: 1, screens: [2, 1] }), { active: 1, screens: [2, 1] });
  assert.deepEqual(normalizePortfolioState({ active: 50, screens: [-1, 90] }), { active: 0, screens: [0, 0] });
  assert.equal(normalizePortfolioState(null, "?project=nickolasgames").active, 1);
  assert.equal(normalizePortfolioState(null, "?project=unknown").active, 0);
  assert.equal(normalizePortfolioState({ active: 0 }, "?project=nickolasgames").active, 0);
});

test("modified clicks retain native open-in-new-tab behaviour", () => {
  const plain = { button: 0 };
  assert.equal(isPlainNavigation(plain), true);
  for (const modifier of ["ctrlKey", "metaKey", "shiftKey", "altKey", "defaultPrevented"]) assert.equal(isPlainNavigation({ ...plain, [modifier]: true }), false);
  assert.equal(isPlainNavigation({ button: 1 }), false);
});

test("detail navigation preserves the portfolio entry and language changes replace the case entry", (context) => {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  context.after(() => {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  });
  const calls = [];
  globalThis.window = {
    history: { state: { existing: true }, replaceState(state, _, url) { this.state = state; calls.push({ state, url }); } },
    location: { assign: (url) => calls.push({ assign: url }), reload: () => calls.push({ reload: true }) },
  };
  globalThis.document = { getElementById: () => ({ getBoundingClientRect: () => ({ top: -250 }) }) };
  const event = () => ({ button: 0, preventDefault() { this.defaultPrevented = true; } });
  openProject(event(), "./project-nickolasgames-uk.html", { active: 1, screens: [2, 1] });
  assert.deepEqual(calls[0].state, { existing: true, portfolio: { active: 1, screens: [2, 1], offset: -250, focus: "project-details-1" } });
  assert.equal(calls[1].assign, "./project-nickolasgames-uk.html?from=portfolio");
  globalThis.window.history.state = { fromPortfolio: true };
  switchProjectLanguage(event(), "./project-nickolasgames-sv.html");
  assert.deepEqual(calls[2], { state: { fromPortfolio: true }, url: "./project-nickolasgames-sv.html" });
  assert.deepEqual(calls[3], { reload: true });
  const count = calls.length;
  openProject({ ...event(), ctrlKey: true }, "./project-autoalex.html", { active: 0, screens: [0, 0] });
  assert.equal(calls.length, count);
});
