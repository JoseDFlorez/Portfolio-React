import { describe, expect, it } from "vitest";
import { toRoman } from "./year-numeral";

describe("toRoman", () => {
  it("converts common years", () => {
    expect(toRoman(2025)).toBe("MMXXV");
    expect(toRoman(1999)).toBe("MCMXCIX");
    expect(toRoman(4)).toBe("IV");
  });
  it("returns empty string for invalid input", () => {
    expect(toRoman(0)).toBe("");
    expect(toRoman(-3)).toBe("");
    expect(toRoman(Number.NaN)).toBe("");
  });
});
