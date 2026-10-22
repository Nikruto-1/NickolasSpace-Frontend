import { projectMetadata } from "../src/data/projectMetadata.js";

const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

export function projectDocument(template, content, route) {
  const metadata = projectMetadata(route);
  let html = template.replace('<html lang="en">', `<html lang="${route.language}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(metadata.title)}</title>`)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${content}</div>`)
    .replace(/<link rel="canonical"[^>]+>/, `<link rel="canonical" href="${metadata.url}" />\n${metadata.alternates.map(({ language, url }) => `    <link rel="alternate" hreflang="${language}" href="${url}" />`).join("\n")}`);
  for (const [attribute, key, value] of [
    ["name", "description", metadata.description],
    ["property", "og:title", metadata.title],
    ["property", "og:description", metadata.description],
    ["property", "og:url", metadata.url],
    ["property", "og:image", metadata.image],
    ["property", "og:image:width", metadata.imageWidth],
    ["property", "og:image:height", metadata.imageHeight],
    ["property", "og:image:type", metadata.imageType],
    ["property", "og:image:alt", metadata.project.name],
    ["name", "twitter:title", metadata.title],
    ["name", "twitter:description", metadata.description],
    ["name", "twitter:image", metadata.image],
    ["name", "twitter:image:alt", metadata.project.name],
  ]) {
    html = html.replace(new RegExp(`<meta\\s+${attribute}="${key}"[^>]+>`), `<meta ${attribute}="${key}" content="${escape(value)}" />`);
  }
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_, json) => {
    const schema = JSON.parse(json);
    const page = schema["@graph"].find((node) => node["@type"] === "WebPage");
    Object.assign(page, {
      "@id": `${metadata.url}#webpage`, url: metadata.url, name: metadata.title,
      description: metadata.description, inLanguage: route.language,
      about: { "@type": "CreativeWork", name: metadata.project.name, url: metadata.project.url },
    });
    schema["@graph"].push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "NickolasSpace", item: "https://nickolasspace.com/" },
        { "@type": "ListItem", position: 2, name: metadata.project.name, item: metadata.url },
      ],
    });
    return `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;
  });
}
