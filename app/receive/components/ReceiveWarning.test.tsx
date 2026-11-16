// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

let setup: string = "idle";
vi.mock("@/components/AccountSetup", () => ({ useAccountSetupStatus: () => setup }));

import ReceiveWarning from "./ReceiveWarning";

afterEach(cleanup);

describe("ReceiveWarning", () => {
  it("always tells people to send only USDC on Solana", () => {
    render(<ReceiveWarning />);
    expect(screen.getByText(/Only send USDC on the Solana network/)).toBeInTheDocument();
    expect(screen.getByText(/may be lost for good/)).toBeInTheDocument();
  });

  it.each(["idle", "creating", "ready"])(
    "does not warn about the sender's cost when setup is %s",
    (status) => {
      setup = status;
      render(<ReceiveWarning />);
      expect(screen.queryByTestId("first-deposit-note")).not.toBeInTheDocument();
    },
  );

  it("warns about the sender's cost only when Kenfi could not set the account up", () => {
    setup = "unavailable";
    render(<ReceiveWarning />);
    const note = screen.getByTestId("first-deposit-note");
    expect(note).toHaveTextContent("one-time account deposit of about 0.0015 SOL");
    expect(note).not.toHaveTextContent("0.002");
  });
});
