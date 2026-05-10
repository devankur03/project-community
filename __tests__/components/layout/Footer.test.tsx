import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("Footer", () => {
  it("renders the Launchpad brand", () => {
    render(<Footer />);
    expect(screen.getByText("Launchpad")).toBeInTheDocument();
  });

  it("renders Product section links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /explore/i })).toHaveAttribute("href", "/explore");
    expect(screen.getByRole("link", { name: /submit a project/i })).toHaveAttribute("href", "/submit");
  });

  it("renders Community section links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: /blog/i })).toHaveAttribute("href", "/blog");
  });

  it("renders Legal section links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: /terms of service/i })).toHaveAttribute("href", "/terms");
  });

  it("renders section headings", () => {
    render(<Footer />);
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Community")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
  });

  it("renders logo link pointing to /", () => {
    render(<Footer />);
    const logoLink = screen.getAllByRole("link", { name: /launchpad/i })[0];
    expect(logoLink).toHaveAttribute("href", "/");
  });
});
