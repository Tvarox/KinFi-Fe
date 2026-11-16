// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import PixelPromptButton from "./PixelPromptButton";

afterEach(cleanup);

describe("PixelPromptButton", () => {
  it("keeps its label after a click, unless a success state is asked for", () => {
    const onClick = vi.fn();
    render(<PixelPromptButton label="Receive" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Receive" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Receive" })).toBeInTheDocument();
    expect(screen.queryByText(/Copied/)).not.toBeInTheDocument();
  });

  it("keeps its label after a click when it only has the dot effect", () => {
    render(<PixelPromptButton label="Sign out" effectOnly onClick={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(screen.queryByText(/Copied/)).not.toBeInTheDocument();
  });

  it("shows Copied after a click when a copy button asks for it", () => {
    render(<PixelPromptButton label="Copy" showSuccessState onClick={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(screen.getByText(/Copied/)).toBeInTheDocument();
  });

  it("does nothing when disabled", () => {
    const onClick = vi.fn();
    render(<PixelPromptButton label="Send" disabled onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("is a link when it has a destination, and keeps its label", () => {
    render(<PixelPromptButton label="Receive" href="/receive" />);
    const link = screen.getByRole("link", { name: "Receive" });
    expect(link).toHaveAttribute("href", "/receive");
    fireEvent.click(link);
    expect(screen.getByRole("link", { name: "Receive" })).toBeInTheDocument();
  });

  it("submits a form when it is a submit button", () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <PixelPromptButton type="submit" label="Go" />
      </form>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
