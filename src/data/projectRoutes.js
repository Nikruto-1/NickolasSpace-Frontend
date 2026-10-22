export const projectSlugs = ["autoalex", "nickolasgames"];
export const projectLanguages = ["en", "uk", "sv"];

export function projectFilename(slug, language = "en") {
  return `project-${slug}${language === "en" ? "" : `-${language}`}.html`;
}

export function projectRoute(pathname) {
  const filename = pathname.split("/").pop();
  for (const [index, slug] of projectSlugs.entries()) {
    for (const language of projectLanguages) {
      if (filename === projectFilename(slug, language)) return { slug, index, language };
    }
  }
  return null;
}
