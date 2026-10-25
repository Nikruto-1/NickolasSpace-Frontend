import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { URL } from "node:url";
import { ASSETS } from "../src/constants.js";

test("every decorative video has a smaller web variant and a real WebP fallback", async () => {
  for (const key of ["hero", "automation", "how", "cta"]) {
    const src = ASSETS[key];
    assert.match(src, /-web\.mp4$/);
    const optimized = await stat(new URL(`../public/${src}`, import.meta.url));
    const original = await stat(new URL(`../public/${src.replace("-web.mp4", ".mp4")}`, import.meta.url));
    assert.ok(optimized.size < original.size, `${key} should be smaller than its original`);
    const poster = await readFile(new URL(`../public/${src.replace(".mp4", "-poster.webp")}`, import.meta.url));
    assert.equal(poster.toString("ascii", 0, 4), "RIFF");
    assert.equal(poster.toString("ascii", 8, 12), "WEBP");
  }
});
