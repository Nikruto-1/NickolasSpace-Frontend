import { test, expect } from "@playwright/test";

test("translated services, contact modal and portfolio return work", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  for (const language of ["UK", "SV", "EN"]) {
    await page.getByRole("button", { name: language, exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", language.toLowerCase());
    await page.locator("#services").scrollIntoViewIfNeeded();
    const select = page.locator("#services select");
    if (await select.isVisible()) {
      for (let i = 0; i < await select.locator("option").count(); i++) {
        await select.selectOption(String(i));
        await expect(page.locator(`#service-panel-${i}`)).toBeVisible();
      }
    } else {
      for (const tab of await page.getByRole("tab").all()) {
        await tab.click();
        await expect(tab).toHaveAttribute("aria-selected", "true");
      }
    }
  }
  await page.locator("#top button").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /kkosmacevskij@gmail.com/ })).toHaveAttribute("href", /^mailto:/);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await page.getByRole("button", { name: "NickolasGames", exact: true }).click();
  await page.locator("#project-details-1").click();
  await expect(page).toHaveURL(/project-nickolasgames\.html/);
  await page.getByRole("link", { name: "UK", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "uk");
  await page.goBack();
  await expect(page.locator("#project-slide-1")).toBeVisible();
  expect(errors).toEqual([]);
});

test("reduced motion retains real posters without loading video", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const mediaRequests = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) mediaRequests.push(request.url());
  });
  await page.goto("/");
  await page.locator("#process").scrollIntoViewIfNeeded();
  const poster = page.locator('#process img[src$="-poster.webp"]');
  await expect(poster).toBeVisible();
  await expect.poll(() => poster.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page.locator("#process video").first()).toBeHidden();
  expect(mediaRequests).toEqual([]);
});

test("a rejected standby play never hides the outgoing video", async ({ page }) => {
  await page.goto("/");
  const videos = page.locator("#top video");
  await expect.poll(() => videos.first().evaluate((video) => video.readyState)).toBeGreaterThanOrEqual(2);
  await videos.nth(1).evaluate((video) => {
    video.play = () => Promise.reject(new Error("Standby unavailable"));
  });
  await videos.first().evaluate((video) => { video.currentTime = video.duration - 0.5; });
  await page.waitForTimeout(1500);
  await expect(videos.first()).toHaveCSS("opacity", "1");
  await expect(videos.nth(1)).toHaveCSS("opacity", "0");
});

test("video can crossfade in both directions", async ({ page }) => {
  await page.goto("/");
  const videos = page.locator("#top video");
  for (const index of [0, 1]) {
    const outgoing = videos.nth(index);
    const incoming = videos.nth(1 - index);
    await expect.poll(() => outgoing.evaluate((video) => video.readyState)).toBeGreaterThanOrEqual(2);
    await outgoing.evaluate((video) => { video.currentTime = video.duration - 1; });
    await expect(incoming).toHaveCSS("opacity", "1");
    await expect(outgoing).toHaveCSS("opacity", "0");
    expect(await incoming.evaluate((video) => !video.paused && video.readyState >= 2)).toBe(true);
  }
});
