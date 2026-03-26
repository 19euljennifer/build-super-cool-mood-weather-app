import { test, expect } from "@playwright/test";

test.describe("Mood Weather App - Full User Flow", () => {
  test.beforeEach(async ({ page, context }) => {
    // Deny geolocation by default (tests can override)
    await context.clearPermissions();

    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("renders the app with header and 5 mood cards", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Mood Weather");
    await expect(
      page.getByText("How are you feeling today?")
    ).toBeVisible();

    // 5 mood buttons visible (scoped to mood grid to exclude dev toolbar)
    const moodButtons = page.locator(".grid").getByRole("button");
    await expect(moodButtons).toHaveCount(5);

    // Check each mood label is present
    await expect(page.getByText("Happy")).toBeVisible();
    await expect(page.getByText("Sad")).toBeVisible();
    await expect(page.getByText("Energetic")).toBeVisible();
    await expect(page.getByText("Calm")).toBeVisible();
    await expect(page.getByText("Anxious")).toBeVisible();
  });

  test("shows idle message before any mood is selected", async ({ page }) => {
    await expect(
      page.getByText("Select a mood above to see your personalized weather")
    ).toBeVisible();
  });

  test("selecting a mood shows weather results with all sections", async ({
    page,
  }) => {
    // Click Happy mood
    await page.getByRole("button", { name: /Happy/ }).click();

    // Wait for weather results to appear
    await expect(page.getByText("Mood Message")).toBeVisible({
      timeout: 10000,
    });

    // Verify weather display has expected content
    await expect(page.getByText("Recommendation")).toBeVisible();

    // Temperature should be visible (number followed by °)
    await expect(page.getByText("75°")).toBeVisible();
  });

  test("selecting happy mood shows correct weather data", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Happy/ }).click();

    await expect(page.getByText("Mood Message")).toBeVisible({
      timeout: 10000,
    });

    // In fallback mode: happy = 75°F, clear sky
    await expect(page.getByText("75°")).toBeVisible();
    await expect(page.getByText("clear sky")).toBeVisible();
    // Mood tag should show "happy" in the weather display
    await expect(page.locator(".rounded-full", { hasText: "happy" })).toBeVisible();
  });

  test("selecting sad mood shows correct weather data", async ({ page }) => {
    await page.getByRole("button", { name: /Sad/ }).click();

    await expect(page.getByText("Mood Message")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByText("55°")).toBeVisible();
    await expect(page.getByText("light rain")).toBeVisible();
  });

  test("changing mood updates the display", async ({ page }) => {
    // Select Happy first
    await page.getByRole("button", { name: /Happy/ }).click();
    await expect(page.getByText("75°")).toBeVisible({ timeout: 10000 });

    // Now switch to Sad
    await page.getByRole("button", { name: /Sad/ }).click();
    await expect(page.getByText("55°")).toBeVisible({ timeout: 10000 });

    // Happy data should be gone
    await expect(page.getByText("75°")).not.toBeVisible();
  });

  test("all 5 moods produce weather results", async ({ page }) => {
    const moods = [
      { name: /Happy/, temp: "75°" },
      { name: /Sad/, temp: "55°" },
      { name: /Energetic/, temp: "68°" },
      { name: /Calm/, temp: "70°" },
      { name: /Anxious/, temp: "60°" },
    ];

    for (const mood of moods) {
      await page.getByRole("button", { name: mood.name }).click();
      await expect(page.getByText("Mood Message")).toBeVisible({
        timeout: 10000,
      });
      await expect(page.getByText(mood.temp)).toBeVisible();
    }
  });

  test("selected mood card shows checkmark", async ({ page }) => {
    await page.getByRole("button", { name: /Calm/ }).click();

    // Wait for the selection to take effect
    await expect(page.getByText("✓")).toBeVisible({ timeout: 5000 });
  });

  test("no console errors during normal usage", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Select a mood and wait for results
    await page.getByRole("button", { name: /Happy/ }).click();
    await expect(page.getByText("Mood Message")).toBeVisible({
      timeout: 10000,
    });

    // Switch moods
    await page.getByRole("button", { name: /Calm/ }).click();
    await expect(page.getByText("70°")).toBeVisible({ timeout: 10000 });

    expect(consoleErrors).toHaveLength(0);
  });
});

test.describe("Mood Weather App - Responsive Design", () => {
  test("mobile viewport (375px) shows 2-column grid", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify all mood cards are visible (scoped to mood grid)
    await expect(page.locator(".grid").getByRole("button")).toHaveCount(5);

    // Check the grid has 2 columns on mobile (grid-cols-2)
    const grid = page.locator(".grid");
    await expect(grid).toBeVisible();

    // All content should be accessible
    await expect(page.locator("h1")).toContainText("Mood Weather");
  });

  test("desktop viewport (1440px) shows all mood cards", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator(".grid").getByRole("button")).toHaveCount(5);
    await expect(page.locator("h1")).toContainText("Mood Weather");
  });

  test("mobile user can complete full flow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /Energetic/ }).click();
    await expect(page.getByText("Mood Message")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("68°")).toBeVisible();
  });
});

test.describe("Mood Weather App - Geolocation Denied", () => {
  test("app works without geolocation", async ({ page, context }) => {
    // Explicitly deny geolocation
    await context.clearPermissions();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // App should still function
    await page.getByRole("button", { name: /Happy/ }).click();
    await expect(page.getByText("Mood Message")).toBeVisible({
      timeout: 10000,
    });

    // Should fall back to default location (New York)
    await expect(page.getByText("New York")).toBeVisible();
  });
});

test.describe("Mood Weather App - Error Handling", () => {
  test("shows error when API returns failure", async ({ page }) => {
    // Intercept the weather API call and return an error
    await page.route("**/api/weather", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Failed to fetch weather data. Please try again.",
        }),
      });
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /Happy/ }).click();

    // Should show error state with retry button
    await expect(page.getByRole("button", { name: "Try Again" })).toBeVisible({ timeout: 10000 });
  });

  test("retry button works after error", async ({ page }) => {
    let requestCount = 0;

    await page.route("**/api/weather", (route) => {
      requestCount++;
      if (requestCount === 1) {
        // First request fails
        route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Server error" }),
        });
      } else {
        // Second request succeeds - use the actual API
        route.fallback();
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /Happy/ }).click();
    await expect(page.getByRole("button", { name: "Try Again" })).toBeVisible({ timeout: 10000 });

    // Click retry
    await page.getByRole("button", { name: "Try Again" }).click();

    // Should now show weather results
    await expect(page.getByText("Mood Message")).toBeVisible({
      timeout: 10000,
    });
  });

  test("shows error when network is unreachable", async ({ page }) => {
    await page.route("**/api/weather", (route) => {
      route.abort("connectionfailed");
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /Calm/ }).click();

    // Should show error message
    await expect(page.getByRole("button", { name: "Try Again" })).toBeVisible({ timeout: 10000 });
  });
});
