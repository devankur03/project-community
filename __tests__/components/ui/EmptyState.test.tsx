import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackageOpen, Rocket } from "lucide-react";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(
      <EmptyState
        icon={PackageOpen}
        title="Nothing here"
        description="No items to show."
      />
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByText("No items to show.")).toBeInTheDocument();
  });

  it("does not render action button when action prop is omitted", () => {
    render(
      <EmptyState
        icon={PackageOpen}
        title="Empty"
        description="No data."
      />
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders action button with label when action prop is provided", () => {
    render(
      <EmptyState
        icon={PackageOpen}
        title="Empty"
        description="No data."
        action={{ label: "Add Item" }}
      />
    );
    expect(screen.getByRole("button", { name: /add item/i })).toBeInTheDocument();
  });

  it("calls action.onClick when the action button is clicked", async () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        icon={PackageOpen}
        title="Empty"
        description="No data."
        action={{ label: "Add Item", onClick }}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /add item/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders action button with icon when icon is provided", () => {
    render(
      <EmptyState
        icon={PackageOpen}
        title="Empty"
        description="No data."
        action={{ label: "Submit", icon: Rocket }}
      />
    );
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});
