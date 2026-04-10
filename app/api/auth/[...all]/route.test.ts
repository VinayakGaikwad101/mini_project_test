// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { GET, POST } from "./route";

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe("Auth Route Handler", () => {
  it("should export GET and POST handlers", () => {
    expect(GET).toBeDefined();
    expect(POST).toBeDefined();
    expect(typeof GET).toBe("function");
    expect(typeof POST).toBe("function");
  });
});
