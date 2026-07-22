import { describe, expect, it } from "vitest";
import {
  DISPOSABLE_EMAIL_MESSAGE,
  emailDomain,
  isDisposableEmail,
} from "../disposable-email";

describe("isDisposableEmail", () => {
  it("blocks known disposable domains", () => {
    expect(isDisposableEmail("user@mailinator.com")).toBe(true);
    expect(isDisposableEmail("x@yopmail.com")).toBe(true);
    expect(isDisposableEmail("a@temp-mail.org")).toBe(true);
  });

  it("blocks subdomains of disposable domains", () => {
    expect(isDisposableEmail("user@foo.mailinator.com")).toBe(true);
  });

  it("allows normal providers", () => {
    expect(isDisposableEmail("tejas@gmail.com")).toBe(false);
    expect(isDisposableEmail("ops@deepshieldai.com")).toBe(false);
  });

  it("exposes a stable user-facing message", () => {
    expect(DISPOSABLE_EMAIL_MESSAGE).toMatch(/permanent email/i);
  });
});

describe("emailDomain", () => {
  it("parses domains", () => {
    expect(emailDomain("A@B.Com")).toBe("b.com");
    expect(emailDomain("bad")).toBeNull();
  });
});
