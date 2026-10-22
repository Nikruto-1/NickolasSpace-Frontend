import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "vite";
import { withSecurityPolicy } from "./security.mjs";
import { projectDocument } from "./project-document.mjs";
import { projectFilename, projectLanguages, projectSlugs } from "../src/data/projectRoutes.js";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { render } = await server.ssrLoadModule("/src/entry-server.jsx");
  const template = await readFile("dist/index.html", "utf8");
  const placeholder = '<div id="root"></div>';
  if (!template.includes(placeholder)) throw new Error("Missing prerender placeholder");
  await writeFile("dist/index.html", withSecurityPolicy(template.replace(placeholder, `<div id="root" data-prerendered="true">${render()}</div>`)));
  const projectUrls = [];
  for (const [index, slug] of projectSlugs.entries()) {
    for (const language of projectLanguages) {
      const filename = projectFilename(slug, language);
      const route = { index, slug, language };
      await writeFile(`dist/${filename}`, withSecurityPolicy(projectDocument(template, render(route), route)));
      projectUrls.push(`  <url><loc>https://nickolasspace.com/${filename}</loc></url>`);
    }
  }
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  await writeFile("dist/sitemap.xml", sitemap.replace("</urlset>", `${projectUrls.join("\n")}\n</urlset>`));
  for (const page of ["privacy.html", "privacy-uk.html", "privacy-sv.html", "404.html"]) {
    const path = `dist/${page}`;
    await writeFile(path, withSecurityPolicy(await readFile(path, "utf8")));
  }
} finally {
  await server.close();
}
