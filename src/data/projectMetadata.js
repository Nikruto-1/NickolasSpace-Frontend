import { translations } from "../i18n/translations.js";
import { projectPages } from "../i18n/projectPages.js";
import { projectStories } from "../i18n/projectStories.js";
import { projectFilename, projectLanguages } from "./projectRoutes.js";

export function projectMetadata(route) {
  const project = translations[route.language].work.cases[route.index];
  return {
    title: `${project.name} | ${projectPages[route.language].eyebrow} | NickolasSpace`,
    description: `${projectStories[route.language].projects[route.index].intro} NickolasSpace.`,
    url: `https://nickolasspace.com/${projectFilename(route.slug, route.language)}`,
    image: `https://nickolasspace.com/assets/project-${route.slug}-social-${route.language}-v1.png`,
    imageWidth: 1200,
    imageHeight: 630,
    imageType: "image/png",
    project,
    alternates: projectLanguages.map((language) => ({ language, url: `https://nickolasspace.com/${projectFilename(route.slug, language)}` })),
  };
}
