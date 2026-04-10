import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import PrescriptionScanner from "../PrescriptionScanner";

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe("PrescriptionScanner Component", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders upload area", () => {
    render(<PrescriptionScanner />);
    expect(screen.getByText(/Drop prescription here/i)).toBeInTheDocument();
  });

  it("shows loading state and result after successful upload", async () => {
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          { content: { parts: [{ text: "Paracetamol 500mg\n1-0-1" }] } },
        ],
      }),
    });

    render(<PrescriptionScanner />);

    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    const file = new File(["dummy"], "prescription.jpg", {
      type: "image/jpeg",
    });

    await user.upload(fileInput, file);

    const processButton = screen.getByText(/Initialize Digitization/i);
    await user.click(processButton);

    // Should show loading state
    expect(screen.getByText(/Processing.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Extraction Complete/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Paracetamol 500mg/i)).toBeInTheDocument();
  });

  it("shows error message when API fails", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: "API Error" } }),
    });

    render(<PrescriptionScanner />);

    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    const file = new File(["dummy"], "prescription.jpg", {
      type: "image/jpeg",
    });

    await user.upload(fileInput, file);
    await user.click(screen.getByText(/Initialize Digitization/i));

    await waitFor(() => {
      expect(screen.getByText(/Connection failed/i)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
