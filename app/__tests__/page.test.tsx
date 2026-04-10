import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Home from "../page";

// Mock the auth module
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// Mock headers from next/headers (critical for server components)
vi.mock("next/headers", () => ({
  headers: vi.fn(() => ({
    get: vi.fn(),
  })),
}));

describe("Home Page", () => {
  it("shows welcome message when not logged in", async () => {
    const { auth } = await import("@/lib/auth");
    (auth.api.getSession as any).mockResolvedValue(null);

    const HomeComponent = await Home();
    render(HomeComponent);

    expect(screen.getByText(/Welcome to MedScript AI/i)).toBeInTheDocument();
  });

  it("shows PrescriptionScanner when user is logged in", async () => {
    const { auth } = await import("@/lib/auth");
    (auth.api.getSession as any).mockResolvedValue({
      user: { name: "Test User", image: "" },
    });

    const HomeComponent = await Home();
    render(HomeComponent);

    expect(
      screen.getByText(/Medical Prescription Recognition/i),
    ).toBeInTheDocument();
  });
});
