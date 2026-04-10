import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Navbar from "../Navbar";

// Mock the auth client module
vi.mock("@/lib/auth-client", () => ({
  useSession: vi.fn(),
  signIn: {
    social: vi.fn(),
  },
  signOut: vi.fn(),
}));

// Get the mocked functions
const mockedUseSession = vi.mocked(
  (await import("@/lib/auth-client")).useSession,
);
const mockedSignInSocial = vi.mocked(
  (await import("@/lib/auth-client")).signIn.social,
);

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Sign in with Google button when not logged in", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      isPending: false,
    });

    render(<Navbar />);
    expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument();
  });

  it("shows user name and Sign Out when logged in", () => {
    mockedUseSession.mockReturnValue({
      data: { user: { name: "Test User", image: "" } },
      isPending: false,
    });

    render(<Navbar />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText(/Sign Out/i)).toBeInTheDocument();
  });

  it("calls signIn when clicking sign in button", async () => {
    mockedUseSession.mockReturnValue({
      data: null,
      isPending: false,
    });

    render(<Navbar />);

    const button = screen.getByText(/Sign in with Google/i);
    fireEvent.click(button);

    // Small delay to allow async handleSignIn to run
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(mockedSignInSocial).toHaveBeenCalledWith({ provider: "google" });
  });
});
