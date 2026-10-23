import { copyFile, readFile, writeFile } from "node:fs/promises";
import { Buffer } from "node:buffer";
import { URL } from "node:url";

const publicFile = (path) => new URL(`../public/${path}`, import.meta.url);
const frames = await Promise.all([32, 48].map(async (size) => {
  const image = await readFile(publicFile(`assets/favicon-cyan-${size}.png`));
  if (image.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" || image.readUInt32BE(16) !== size || image.readUInt32BE(20) !== size) {
    throw new Error(`Invalid source favicon: ${size}`);
  }
  return { size, image };
}));

// ICO supports PNG payloads, preserving the existing logo without raster edits.
const directory = Buffer.alloc(6 + frames.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(frames.length, 4);
let offset = directory.length;
frames.forEach(({ size, image }, index) => {
  const entry = 6 + index * 16;
  directory[entry] = size;
  directory[entry + 1] = size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(image.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile(publicFile("favicon.ico"), Buffer.concat([directory, ...frames.map(({ image }) => image)]));

for (const [source, destinations] of [
  ["assets/favicon-cyan-32.png", ["assets/favicon-32.png"]],
  ["assets/favicon-cyan-48.png", ["favicon.png", "assets/favicon-48.png"]],
  ["assets/apple-touch-icon-cyan.png", ["apple-touch-icon.png", "apple-touch-icon-precomposed.png", "assets/apple-touch-icon.png"]],
]) {
  for (const destination of destinations) await copyFile(publicFile(source), publicFile(destination));
}
