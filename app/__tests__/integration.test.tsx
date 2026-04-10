import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PrescriptionScanner from "@/components/PrescriptionScanner";

describe("Prescription Upload Integration", () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch as any;

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("full flow: upload image → show result", async () => {
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          { content: { parts: [{ text: "Amoxicillin 500mg\nBD" }] } },
        ],
      }),
    });

    render(<PrescriptionScanner />);

    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    const file = new File(["test"], "rx.jpg", { type: "image/jpeg" });

    await user.upload(fileInput, file);
    await user.click(screen.getByText(/Initialize Digitization/i));

    await waitFor(() => {
      expect(screen.getByText(/Extraction Complete/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Amoxicillin 500mg/i)).toBeInTheDocument();
  });
});
