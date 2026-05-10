import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VoteButton } from "@/components/ui/VoteButton";

const voteProductMock = vi.fn();

vi.mock("@/lib/products/product-actions", () => ({
  voteProduct: (...args: unknown[]) => voteProductMock(...args),
}));

describe("VoteButton", () => {
  beforeEach(() => {
    // Keep transition pending so useOptimistic value stays visible during assertions
    voteProductMock.mockReturnValue(new Promise(() => {}));
  });

  it("renders the initial vote count", () => {
    render(<VoteButton productId={1} initialVotes={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("shows optimistic +1 on upvote click", async () => {
    render(<VoteButton productId={1} initialVotes={10} />);
    await userEvent.click(screen.getByLabelText("Upvote"));
    expect(await screen.findByText("11")).toBeInTheDocument();
  });

  it("shows optimistic -1 on downvote click", async () => {
    render(<VoteButton productId={1} initialVotes={10} />);
    await userEvent.click(screen.getByLabelText("Downvote"));
    expect(await screen.findByText("9")).toBeInTheDocument();
  });

  it("calls voteProduct with correct args on upvote", async () => {
    voteProductMock.mockResolvedValue(undefined);
    render(<VoteButton productId={7} initialVotes={5} />);
    await userEvent.click(screen.getByLabelText("Upvote"));
    expect(voteProductMock).toHaveBeenCalledWith(7, "up");
  });

  it("calls voteProduct with correct args on downvote", async () => {
    voteProductMock.mockResolvedValue(undefined);
    render(<VoteButton productId={7} initialVotes={5} />);
    await userEvent.click(screen.getByLabelText("Downvote"));
    expect(voteProductMock).toHaveBeenCalledWith(7, "down");
  });

  it("renders upvote and downvote buttons", () => {
    render(<VoteButton productId={1} initialVotes={5} />);
    expect(screen.getByLabelText("Upvote")).toBeInTheDocument();
    expect(screen.getByLabelText("Downvote")).toBeInTheDocument();
  });
})
