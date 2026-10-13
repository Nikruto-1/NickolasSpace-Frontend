import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { render } = await server.ssrLoadModule("/src/entry-server.jsx");
  const template = await readFile("dist/index.html", "utf8");
  const placeholder = '<div id="root"></div>';
  if (!template.includes(placeholder)) throw new Error("Missing prerender placeholder");
  await writeFile("dist/index.html", template.replace(placeholder, `<div id="root" data-prerendered="true">${render()}</div>`));
} finally {
  await server.close();
}
