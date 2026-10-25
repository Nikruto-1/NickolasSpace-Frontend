import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { URL } from "node:url";
import { projectFilename, projectRoute, projectLanguages, projectSlugs } from "../src/data/projectRoutes.js";
import { projectMetadata } from "../src/data/projectMetadata.js";
import { projectMedia } from "../src/data/projectMedia.js";
import { translations } from "../src/i18n/translations.js";
import { caseStudies } from "../src/i18n/caseStudies.js";
import { projectPages } from "../src/i18n/projectPages.js";
import { projectStories } from "../src/i18n/projectStories.js";
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

test("case galleries keep accessible image links without a duplicate text link", async () => {
  for (const slug of projectSlugs) {
    for (const language of projectLanguages) {
      const html = await read(projectFilename(slug, language));
      const label = escape(translations[language].work.openImage);
      assert.ok(html.includes(`aria-label="${label}:`));
      assert.ok(!html.includes(`>${label}<`));
    }
  }
});

test("each case has translated screen context, contribution, decisions and a final invitation", async () => {
  for (const [index, slug] of projectSlugs.entries()) {
    for (const language of projectLanguages) {
      const copy = projectStories[language];
      const story = copy.projects[index];
      const html = await read(projectFilename(slug, language));
      assert.equal(story.views.length, projectMedia(index, language).screens.length);
      for (const view of story.views) assert.ok(view.every((text) => text.trim()));
      for (const value of [story.intro, story.role, copy.gallery, copy.decisions, copy.closingTitle, copy.closingText, ...story.views[0], ...story.decisions.flat()]) {
        assert.ok(html.includes(escape(value)), `${slug}/${language}: ${value}`);
      }
      for (const id of ["case-gallery-title", "case-overview", "case-features", "case-decisions", "case-flow", "case-contact-title"]) {
        assert.equal((html.match(new RegExp(`id="${id}"`, "g")) || []).length, 1);
      }
    }
  }
});

test("each case has its own real, language-specific 1200 by 630 social cover", async () => {
  const images = new Set();
  for (const [index, slug] of projectSlugs.entries()) {
    for (const language of projectLanguages) {
      const metadata = projectMetadata({ index, slug, language });
      images.add(metadata.image);
      assert.equal(metadata.imageType, "image/png");
      const bytes = await readFile(new URL(`../dist/${new URL(metadata.image).pathname.slice(1)}`, import.meta.url));
      assert.equal(bytes.subarray(1, 4).toString(), "PNG");
      assert.equal(bytes.readUInt32BE(16), metadata.imageWidth);
      assert.equal(bytes.readUInt32BE(20), metadata.imageHeight);
      assert.deepEqual([metadata.imageWidth, metadata.imageHeight], [1200, 630]);
      const html = await read(projectFilename(slug, language));
      for (const key of ["og:image", "twitter:image"]) assert.ok(html.includes(`content="${metadata.image}"`) && html.includes(key));
    }
  }
  assert.equal(images.size, 6);
});

test("portfolio restoration accepts only valid projects and gallery indices", () => {
  assert.deepEqual(normalizePortfolioState({ active: 1, screens: [2, 1] }), { active: 1, screens: [2, 1] });
  assert.deepEqual(normalizePortfolioState({ active: 50, screens: [-1, 90] }), { active: 0, screens: [0, 0] });
  assert.equal(normalizePortfolioState(null, "?project=nickolasgames").active, 1);
  assert.equal(normalizePortfolioState(null, "?project=unknown").active, 0);
  assert.equal(normalizePortfolioState({ active: 0 }, "?project=nickolasgames").active, 0);
  assert.deepEqual(normalizePortfolioState({ active: 0, screens: [3, 1] }), { active: 0, screens: [3, 1] });
  assert.deepEqual(normalizePortfolioState({ active: 0, screens: [5, 1] }), { active: 0, screens: [5, 1] });
  assert.deepEqual(normalizePortfolioState({ active: 0, screens: [7, 1] }), { active: 0, screens: [7, 1] });
  assert.deepEqual(normalizePortfolioState({ active: 0, screens: [8, 2] }), { active: 0, screens: [0, 0] });
});

test("the AutoAlex admin overview and translated capabilities are included in each case", async () => {
  for (const language of projectLanguages) {
    const media = projectMedia(0, language);
    assert.equal(media.screens.length, translations[language].work.screens.length);
    assert.deepEqual(media.screens.filter((screen) => screen.demo).map((screen) => screen.src), [
      "./assets/autoalex-admin-dashboard.png", "./assets/autoalex-admin-dashboard-mobile.svg", "./assets/autoalex-admin-vehicles.png", "./assets/autoalex-admin-enquiries.png", "./assets/autoalex-admin-enquiries-mobile.svg",
    ]);
    assert.ok(translations[language].work.adminDemo.trim());
    const html = await read(projectFilename("autoalex", language));
    for (const label of translations[language].work.screens) assert.ok(html.includes(escape(label)));
    for (const [title, description] of projectPages[language].autoFeatures) {
      assert.ok(html.includes(escape(title)));
      assert.ok(html.includes(escape(description)));
    }
  }
  for (const view of ["dashboard", "vehicles", "enquiries"]) {
    for (const suffix of [".png", "-720.webp", "-1440.webp"]) {
      assert.ok((await stat(new URL(`../dist/assets/autoalex-admin-${view}${suffix}`, import.meta.url))).size > 0);
    }
  }
});

test("modified clicks retain native open-in-new-tab behaviour", () => {
  const plain = { button: 0 };
  assert.equal(isPlainNavigation(plain), true);
  for (const modifier of ["ctrlKey", "metaKey", "shiftKey", "altKey", "defaultPrevented"]) assert.equal(isPlainNavigation({ ...plain, [modifier]: true }), false);
  assert.equal(isPlainNavigation({ button: 1 }), false);
});

test("mobile admin screenshots follow their desktop views and preserve the original pixels", async () => {
  const screens = projectMedia(0, "en").screens;
  for (const [index, view] of [[4, "dashboard"], [7, "enquiries"]]) {
    const screen = screens[index];
    assert.equal(screen.src, `./assets/autoalex-admin-${view}-mobile.svg`);
    assert.ok(screens[index - 1].src.endsWith(`admin-${view}.png`));
    assert.equal(screen.demo, true);
    assert.equal(screen.device, "phone");
    const svg = await read(screen.src.replace("./", ""));
    assert.match(svg, /viewBox="0 91 588 1045"/);
    const data = svg.match(/href="data:image\/jpeg;base64,([A-Za-z0-9+/=]+)"/);
    assert.ok(data, "The crop must embed the unchanged source JPEG, not a redrawn interface");
    const bytes = Buffer.from(data[1], "base64");
    assert.equal(bytes.subarray(0, 3).toString("hex"), "ffd8ff");
    assert.doesNotMatch(svg, /<script|https?:\/\/(?!www\.w3\.org)/);
    for (const language of projectLanguages) {
      assert.ok(translations[language].work.screens[index].trim());
      assert.ok(projectStories[language].projects[0].views[index].every((value) => value.trim()));
    }
  }
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
