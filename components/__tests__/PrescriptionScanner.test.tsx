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
});
