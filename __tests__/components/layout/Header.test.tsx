import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/Header";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock Clerk
vi.mock("@clerk/nextjs", () => {
  const UserButtonMock = ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="user-button">{children}</div>
  );
  UserButtonMock.MenuItems = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
  UserButtonMock.Link = ({ label }: { label: string }) => <span>{label}</span>;

  return {
    useAuth: vi.fn(() => ({ isSignedIn: false })),
    SignInButton: ({ children }: { children: React.ReactNode }) => <div data-testid="sign-in-button">{children}</div>,
    SignUpButton: ({ children }: { children: React.ReactNode }) => <div data-testid="sign-up-button">{children}</div>,
    UserButton: UserButtonMock,
  };
});

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

describe("Header", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: false } as ReturnType<typeof useAuth>);
    vi.mocked(usePathname).mockReturnValue("/");
  });

  it("renders the Launchpad logo", () => {
    render(<Header />);
    expect(screen.getByText("Launchpad")).toBeInTheDocument();
  });

  it("renders Home and Explore nav links", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /explore/i })).toHaveAttribute("href", "/explore");
  });

  it("shows sign-in and sign-up buttons when not signed in", () => {
    render(<Header />);
    expect(screen.getByTestId("sign-in-button")).toBeInTheDocument();
    expect(screen.getByTestId("sign-up-button")).toBeInTheDocument();
  });

  it("shows Submit Project and UserButton when signed in", () => {
    vi.mocked(useAuth).mockReturnValue({ isSignedIn: true } as ReturnType<typeof useAuth>);
    render(<Header />);
    expect(screen.getByRole("link", { name: /submit project/i })).toHaveAttribute("href", "/submit");
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });

  it("applies active styles to Home link on / path", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<Header />);
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink.className).toContain("bg-accent");
  });

  it("applies active styles to Explore link on /explore path", () => {
    vi.mocked(usePathname).mockReturnValue("/explore");
    render(<Header />);
    const exploreLink = screen.getByRole("link", { name: /explore/i });
    expect(exploreLink.className).toContain("bg-accent");
  });

  it("does not apply active styles to Home link on /explore path", () => {
    vi.mocked(usePathname).mockReturnValue("/explore");
    render(<Header />);
    const homeLink = screen.getByRole("link", { name: /home/i });
    // inactive link uses text-muted-foreground, not the active bg-accent text-foreground pair
    expect(homeLink.className).toContain("text-muted-foreground");
    expect(homeLink.className).not.toContain("bg-accent text-foreground");
  });
});
