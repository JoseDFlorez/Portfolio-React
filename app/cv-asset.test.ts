import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const cvPath = "public/cv/jose-florez-cv.pdf";

describe("CV asset", () => {
  it("keeps the public download target available as a PDF", () => {
    expect(existsSync(cvPath)).toBe(true);

    const header = readFileSync(cvPath).subarray(0, 5).toString("ascii");
    expect(header).toBe("%PDF-");
  });
});
