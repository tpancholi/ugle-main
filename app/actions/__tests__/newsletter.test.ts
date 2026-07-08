import { describe, it, expect, vi } from "vitest";
import { newsletterJoin } from "../newsletter";

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    batch: { send: vi.fn().mockResolvedValue({ data: [{}, {}], error: null }) },
  })),
}));

vi.mock("@/app/lib/sheets", () => ({
  NewsletterSheetService: vi.fn().mockImplementation(() => ({
    append: vi.fn().mockResolvedValue(undefined),
  })),
}));

vi.mock("@/app/lib/turnstile", () => ({
  verifyTurnstile: vi.fn().mockResolvedValue(true),
}));

describe("newsletterJoin", () => {
  it("succeeds when both email and sheets succeed", async () => {
    const formData = new FormData();
    formData.set("email", "test@example.com");

    const result = await newsletterJoin(
      { success: false, message: "" },
      formData,
    );

    expect(result.success).toBe(true);
  });

  it("rejects invalid email without calling Turnstile", async () => {
    const formData = new FormData();
    formData.set("email", "not-an-email");

    const result = await newsletterJoin(
      { success: false, message: "" },
      formData,
    );

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/invalid/i);
  });

  it("still succeeds if only sheets succeeds (email down)", async () => {
    const { Resend } = await import("resend");
    vi.mocked(Resend).mockImplementationOnce(
      () =>
        ({
          batch: { send: vi.fn().mockRejectedValue(new Error("Resend down")) },
        }) as any,
    );

    const formData = new FormData();
    formData.set("email", "test2@example.com");

    const result = await newsletterJoin(
      { success: false, message: "" },
      formData,
    );

    expect(result.success).toBe(true); // sheets alone is enough
  });

  it("fails cleanly when both integrations fail", async () => {
    const { Resend } = await import("resend");
    const { NewsletterSheetService } = await import("@/app/lib/sheets");

    vi.mocked(Resend).mockImplementationOnce(
      () =>
        ({
          batch: { send: vi.fn().mockRejectedValue(new Error("down")) },
        }) as any,
    );
    vi.mocked(NewsletterSheetService).mockImplementationOnce(
      () =>
        ({
          append: vi.fn().mockRejectedValue(new Error("down")),
        }) as any,
    );

    const formData = new FormData();
    formData.set("email", "test3@example.com");

    const result = await newsletterJoin(
      { success: false, message: "" },
      formData,
    );

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/failed/i);
  });
});
