import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { URL } from "node:url";

const read = (path) => readFile(new URL(`../dist/${path}`, import.meta.url));

test("the cyan logo is used consistently without changing display dimensions", async () => {
  const html = (await read("index.html")).toString();
  for (const size of [96, 480]) {
    assert.ok(html.includes(`src="./assets/logo-cyan-${size}.webp"`));
    const asset = await read(`assets/logo-cyan-${size}.webp`);
    assert.equal(asset.toString("ascii", 0, 4), "RIFF");
    assert.equal(asset.toString("ascii", 8, 12), "WEBP");
  }
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema["@graph"].find((node) => node["@type"] === "Organization").logo, "https://nickolasspace.com/assets/logo-cyan.png");
  const source = await read("assets/logo-cyan.png");
  assert.equal(source.readUInt32BE(16), source.readUInt32BE(20));
  assert.equal(source[25], 6, "The logo must retain RGBA transparency");
});

test("new favicon URLs point to real PNGs with their declared sizes", async () => {
  const html = (await read("index.html")).toString();
  for (const [name, size] of [["favicon-cyan-32.png", 32], ["favicon-cyan-48.png", 48], ["apple-touch-icon-cyan.png", 180]]) {
    assert.ok(html.includes(`href="./assets/${name}"`));
    const asset = await read(`assets/${name}`);
    assert.equal(asset.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(asset.readUInt32BE(16), size);
    assert.equal(asset.readUInt32BE(20), size);
  }
  for (const name of ["privacy.html", "privacy-uk.html", "privacy-sv.html"]) {
    assert.ok((await read(name)).toString().includes('href="./assets/favicon-cyan-32.png"'));
  }
});
