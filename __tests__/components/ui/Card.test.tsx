import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

describe("Card components", () => {
  it("renders Card with children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders CardTitle", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>My Title</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("renders CardDescription", () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Short description</CardDescription>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText("Short description")).toBeInTheDocument();
  });

  it("renders CardContent", () => {
    render(
      <Card>
        <CardContent>Body text</CardContent>
      </Card>
    );
    expect(screen.getByText("Body text")).toBeInTheDocument();
  });

  it("renders CardFooter", () => {
    render(
      <Card>
        <CardFooter>Footer text</CardFooter>
      </Card>
    );
    expect(screen.getByText("Footer text")).toBeInTheDocument();
  });

  it("renders CardAction", () => {
    render(
      <Card>
        <CardHeader>
          <CardAction>Action</CardAction>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("applies custom className to Card", () => {
    const { container } = render(<Card className="custom-class">content</Card>);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders Card with sm size", () => {
    const { container } = render(<Card size="sm">content</Card>);
    expect(container.firstChild).toHaveAttribute("data-size", "sm");
  });
});
