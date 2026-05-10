import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SubmitProductForm } from "@/components/submit/SubmitProductForm";

// Mock the server action
vi.mock("@/lib/products/product-actions", () => ({
  addProduct: vi.fn(),
}));

// Mock Next.js useActionState — simulate idle state by default
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useActionState: vi.fn((action, initial) => [initial, vi.fn(), false]),
  };
});

import { useActionState } from "react";
import { addProduct } from "@/lib/products/product-actions";

describe("SubmitProductForm", () => {
  beforeEach(() => {
    vi.mocked(useActionState).mockReturnValue([null, vi.fn(), false]);
  });

  it("renders all form fields", () => {
    render(<SubmitProductForm />);
    expect(screen.getByPlaceholderText(/acme analytics/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("acme-analytics")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/analytics platform/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe your product/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/yourproduct\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/analytics, saas/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<SubmitProductForm />);
    expect(screen.getByRole("button", { name: /submit project/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<SubmitProductForm />);
    await userEvent.click(screen.getByRole("button", { name: /submit project/i }));
    // multiple fields may show "at least 2 characters" — just check at least one appears
    const errors = await screen.findAllByText(/at least 2 characters/i);
    expect(errors.length).toBeGreaterThanOrEqual(1);
  });

  it("auto-fills slug from product name", () => {
    render(<SubmitProductForm />);
    // Use fireEvent.change to fire a single change with the full value
    fireEvent.change(screen.getByPlaceholderText(/acme analytics/i), {
      target: { value: "My Cool App" },
    });
    expect(screen.getByPlaceholderText("acme-analytics")).toHaveValue("my-cool-app");
  });

  it("shows server error banner when state has success=false", () => {
    vi.mocked(useActionState).mockReturnValue([
      { success: false as const, error: "Something went wrong. Please try again." },
      vi.fn(),
      false,
    ]);
    render(<SubmitProductForm />);
    expect(screen.getByText("Something went wrong. Please try again.")).toBeInTheDocument();
  });

  it("shows success screen when showSuccess is true", async () => {
    vi.mocked(useActionState).mockReturnValue([
      { success: true as const },
      vi.fn(),
      false,
    ]);
    render(<SubmitProductForm />);
    expect(await screen.findByText("Submission received!")).toBeInTheDocument();
  });

  it("renders 'Submit another project' button on success screen", async () => {
    vi.mocked(useActionState).mockReturnValue([{ success: true as const }, vi.fn(), false]);
    render(<SubmitProductForm />);
    expect(await screen.findByRole("button", { name: /submit another project/i })).toBeInTheDocument();
  });

  it("shows spinner when isPending is true", () => {
    vi.mocked(useActionState).mockReturnValue([null, vi.fn(), true]);
    render(<SubmitProductForm />);
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();
  });

  it("disables submit button when isPending is true", () => {
    vi.mocked(useActionState).mockReturnValue([null, vi.fn(), true]);
    render(<SubmitProductForm />);
    expect(screen.getByRole("button", { name: /submitting/i })).toBeDisabled();
  });

  it("shows server field error for slug", () => {
    vi.mocked(useActionState).mockReturnValue([
      {
        success: false as const,
        error: "Please fix the errors below.",
        fieldErrors: { slug: ["This slug is already taken. Please choose a different one."] },
      },
      vi.fn(),
      false,
    ]);
    render(<SubmitProductForm />);
    expect(screen.getByText("This slug is already taken. Please choose a different one.")).toBeInTheDocument();
  });
});
