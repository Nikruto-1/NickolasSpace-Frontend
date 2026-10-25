import { test, expect } from "@playwright/test";
import { translations } from "../../src/i18n/translations.js";

test("mobile admin views load in the portfolio and each translated case", async ({ page }) => {
  const errors = [];
  const failed = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) failed.push(response.url());
  });
  for (const language of ["en", "uk", "sv"]) {
    const suffix = language === "en" ? "" : `-${language}`;
    await page.goto(`/project-autoalex${suffix}.html`);
    const gallery = page.locator(".case-gallery");
    for (const [index, view] of [[4, "dashboard"], [7, "enquiries"]]) {
      await gallery.getByRole("button", { name: translations[language].work.screens[index], exact: true }).click();
      const preview = gallery.locator(".case-preview");
      const image = preview.locator(".phone-mockup img");
      await expect(image).toHaveAttribute("src", `./assets/autoalex-admin-${view}-mobile.svg`);
      await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
      await expect(gallery.locator("source")).toHaveCount(0);
      await preview.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      const expandedImage = dialog.locator(".phone-mockup img");
      await expect(expandedImage).toHaveAttribute("src", `./assets/autoalex-admin-${view}-mobile.svg`);
      expect((await expandedImage.boundingBox()).width).toBeLessThanOrEqual(588);
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(preview).toBeFocused();
      expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth > globalThis.innerWidth)).toBe(false);
    }
  }
  await page.goto("/");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  const portfolio = page.locator("#project-slide-0");
  await portfolio.getByRole("button", { name: "Mobile dashboard", exact: true }).click();
  await expect(portfolio.locator(".project-preview .phone-mockup img")).toHaveAttribute("src", /dashboard-mobile\.svg$/);
  await portfolio.getByRole("button", { name: "Mobile enquiries", exact: true }).click();
  await expect(portfolio.locator(".project-preview .phone-mockup img")).toHaveAttribute("src", /enquiries-mobile\.svg$/);
  await portfolio.locator(".project-preview").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});
