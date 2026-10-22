import { translations } from "../i18n/translations.js";
import { projectPages } from "../i18n/projectPages.js";
import { projectMedia } from "./projectMedia.js";
import { projectFilename, projectLanguages } from "./projectRoutes.js";

export function projectMetadata(route) {
  const project = translations[route.language].work.cases[route.index];
  const image = projectMedia(route.index, route.language).screens[0];
  return {
    title: `${project.name} | ${projectPages[route.language].eyebrow} | NickolasSpace`,
    description: project.desc,
    url: `https://nickolasspace.com/${projectFilename(route.slug, route.language)}`,
    image: `https://nickolasspace.com/${image.src.replace("./", "").split("?")[0]}`,
    imageWidth: image.width,
    imageHeight: image.height,
    imageType: image.src.includes(".jpeg") ? "image/jpeg" : "image/png",
    project,
    alternates: projectLanguages.map((language) => ({ language, url: `https://nickolasspace.com/${projectFilename(route.slug, language)}` })),
  };
}
