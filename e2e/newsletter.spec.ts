import { test, expect } from "@playwright/test";
import { getLastSheetRow } from "./helpers/sheets";

test.describe("Newsletter signup", () => {
  test("submits successfully end-to-end", async ({ page }) => {
    const testEmail = `e2e-${Date.now()}@example.com`;

    await page.goto("/");

    // Turnstile is set to the "always passes" test sitekey in .env.test,
    // so the invisible widget resolves without a real challenge.
    await page.fill('input[name="email"]', testEmail);
    await page.click('button[type="submit"]');

    // Wait for success UI
    await expect(page.getByText("Successfully Joined")).toBeVisible({
      timeout: 10_000,
    });

    // Verify Google Sheets got the row
    const row = await getLastSheetRow(
      process.env.GOOGLE_SPREADSHEET_ID!,
      "Newsletter",
    );
    expect(row[0]).toBe(testEmail);

    // Verify Resend accepted the send — query by recipient via Resend API
    const res = await fetch("https://api.resend.com/emails", {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });
    const { data } = await res.json();
    const sent = data.find((e: any) => e.to.includes(testEmail));
    expect(sent).toBeTruthy();
    expect(sent.last_event).toBe("delivered");
  });

  test("still succeeds when Turnstile blocks (fails open per your design)", async ({
    page,
  }) => {
    // Requires a build/deploy variant with the "always blocks" test secret
    // set server-side, OR run this against a route where you've swapped
    // TURNSTILE_SECRET_KEY to the blocking test key for this test run.
    await page.goto("/");
    const testEmail = `e2e-blocked-${Date.now()}@example.com`;
    await page.fill('input[name="email"]', testEmail);
    await page.click('button[type="submit"]');

    // Your verifyTurnstile fails open by design, so this should still
    // succeed. If it doesn't, that's a regression in the fail-open logic.
    await expect(page.getByText("Successfully Joined")).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/");
    await page.fill('input[name="email"]', "not-an-email");
    await page.click('button[type="submit"]');
    await expect(page.getByText(/invalid/i)).toBeVisible();
  });
});
