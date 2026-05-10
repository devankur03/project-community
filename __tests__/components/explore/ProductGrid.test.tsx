import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductGrid } from "@/components/explore/ProductGrid";
import type { Product } from "@/db/schema";

vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

vi.mock("@/lib/products/product-actions", () => ({
  voteProduct: vi.fn().mockResolvedValue(undefined),
}));

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Alpha Tool",
    slug: "alpha-tool",
    tagLine: "The best alpha tool",
    description: "A great alpha tool for developers",
    webUrl: "https://alpha.com",
    tags: ["ai", "developer-tools"],
    voteCount: 50,
    createdAt: new Date("2024-01-01"),
    approvedAt: new Date("2024-01-02"),
    status: "approved",
    submittedBy: "user_1",
    userId: "user_1",
    organizationId: null,
  },
  {
    id: 2,
    name: "Beta App",
    slug: "beta-app",
    tagLine: "A beta app for everyone",
    description: "Beta app description goes here",
    webUrl: "https://beta.com",
    tags: ["saas", "productivity"],
    voteCount: 20,
    createdAt: new Date("2024-01-03"),
    approvedAt: new Date("2024-01-04"),
    status: "approved",
    submittedBy: "user_2",
    userId: "user_2",
    organizationId: null,
  },
];

describe("ProductGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all products", () => {
    render(<ProductGrid products={mockProducts} allTags={["ai", "saas"]} />);
    expect(screen.getByText("Alpha Tool")).toBeInTheDocument();
    expect(screen.getByText("Beta App")).toBeInTheDocument();
  });

  it("renders product taglines", () => {
    render(<ProductGrid products={mockProducts} allTags={[]} />);
    expect(screen.getByText("The best alpha tool")).toBeInTheDocument();
    expect(screen.getByText("A beta app for everyone")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<ProductGrid products={mockProducts} allTags={[]} />);
    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
  });

  it("filters products by search query", async () => {
    render(<ProductGrid products={mockProducts} allTags={[]} />);
    await userEvent.type(screen.getByPlaceholderText(/search products/i), "Alpha");
    expect(screen.getByText("Alpha Tool")).toBeInTheDocument();
    expect(screen.queryByText("Beta App")).not.toBeInTheDocument();
  });

  it("clears search when clear button is clicked", async () => {
    render(<ProductGrid products={mockProducts} allTags={[]} />);
    await userEvent.type(screen.getByPlaceholderText(/search products/i), "Alpha");
    await userEvent.click(screen.getByLabelText("Clear search"));
    expect(screen.getByText("Beta App")).toBeInTheDocument();
  });

  it("renders tag filter pills", () => {
    render(<ProductGrid products={mockProducts} allTags={["ai", "saas"]} />);
    // getAllByRole because tags also appear on product cards
    const aiButtons = screen.getAllByRole("button", { name: "ai" });
    const saasButtons = screen.getAllByRole("button", { name: "saas" });
    expect(aiButtons.length).toBeGreaterThanOrEqual(1);
    expect(saasButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("filters products by tag", async () => {
    render(<ProductGrid products={mockProducts} allTags={["ai", "saas"]} />);
    // click the filter pill (first one in the filter section)
    const aiPills = screen.getAllByRole("button", { name: "ai" });
    await userEvent.click(aiPills[0]);
    expect(screen.getByText("Alpha Tool")).toBeInTheDocument();
    expect(screen.queryByText("Beta App")).not.toBeInTheDocument();
  });

  it("resets tag filter when All is clicked", async () => {
    render(<ProductGrid products={mockProducts} allTags={["ai"]} />);
    const aiPills = screen.getAllByRole("button", { name: "ai" });
    await userEvent.click(aiPills[0]);
    await userEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText("Alpha Tool")).toBeInTheDocument();
    expect(screen.getByText("Beta App")).toBeInTheDocument();
  });

  it("renders Most Voted and Latest sort buttons", () => {
    render(<ProductGrid products={mockProducts} allTags={[]} />);
    expect(screen.getByRole("button", { name: /most voted/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /latest/i })).toBeInTheDocument();
  });

  it("shows empty state when no products match search", async () => {
    render(<ProductGrid products={mockProducts} allTags={[]} />);
    await userEvent.type(screen.getByPlaceholderText(/search products/i), "xyznotexist");
    expect(screen.getByText("No products found")).toBeInTheDocument();
  });

  it("shows product count", () => {
    render(<ProductGrid products={mockProducts} allTags={[]} />);
    expect(screen.getByText(/2 products/i)).toBeInTheDocument();
  });

  it("renders Filter by label", () => {
    render(<ProductGrid products={mockProducts} allTags={["ai"]} />);
    expect(screen.getByText(/filter by/i)).toBeInTheDocument();
  });
});
