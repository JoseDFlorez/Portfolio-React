import { describe, expect, it } from "vitest";
import { contactSchema } from "./contact.schema";

describe("contactSchema", () => {
  const valid = {
    name: "José",
    email: "jose@example.com",
    subject: "Hello",
    message: "This is a sufficiently long message.",
    website: "",
  };

  it("accepts a valid payload", () => {
    expect(() => contactSchema.parse(valid)).not.toThrow();
  });

  it("rejects missing name", () => {
    const result = contactSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects short message", () => {
    const result = contactSchema.safeParse({ ...valid, message: "hi" });
    expect(result.success).toBe(false);
  });

  it("rejects filled honeypot", () => {
    const result = contactSchema.safeParse({
      ...valid,
      website: "https://evil.example",
    });
    expect(result.success).toBe(false);
  });
});
