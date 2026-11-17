// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import type { SendState } from "@/lib/use-send";

const prepare = vi.fn();
const confirm = vi.fn();
const back = vi.fn();
const reset = vi.fn();
const refreshBalance = vi.fn();
let sendState: SendState = { step: "form", error: null };
let balance: unknown = { state: { status: "ready", data: { usdc: "1842600000" } }, refresh: refreshBalance };

vi.mock("@/lib/use-send", () => ({ useSend: () => ({ state: sendState, prepare, confirm, back, reset }) }));
vi.mock("@/lib/use-backend-query", () => ({ useUsdcBalance: () => balance }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

import SendFlow from "./SendFlow";

const ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const prepared = {
  send_id: "s1",
  transaction: "AQID",
  from_address: "FROM",
  to_address: ADDRESS,
  amount: "10255000",
  network: "solana" as const,
  expires_at: "2099-01-01T00:00:00Z",
};

beforeEach(() => {
  [prepare, confirm, back, reset, refreshBalance].forEach((f) => f.mockReset());
  sendState = { step: "form", error: null };
  balance = { state: { status: "ready", data: { usdc: "1842600000" } }, refresh: refreshBalance };
});
afterEach(cleanup);

const type = (label: RegExp | string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe("SendFlow: form", () => {
  it("keeps Review payment off until the address and amount are valid", () => {
    render(<SendFlow />);
    const button = screen.getByRole("button", { name: "Review payment" });
    expect(button).toBeDisabled();

    type("To", ADDRESS);
    expect(button).toBeDisabled();
    type("Amount", "10.25");
    expect(button).toBeEnabled();
  });

  it("explains a bad address and limits decimal input", () => {
    render(<SendFlow />);
    type("To", "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913");
    type("Amount", "1.1234567");
    expect(screen.getByText(/valid Solana address/)).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toHaveValue("1.12345");
    expect(screen.getByRole("button", { name: "Review payment" })).toBeDisabled();
  });

  it("blocks an amount above the balance", () => {
    render(<SendFlow />);
    type("To", ADDRESS);
    type("Amount", "1842.61");
    expect(screen.getByText("That is more than your balance.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Review payment" })).toBeDisabled();
  });

  it("fills the whole balance with Max", () => {
    render(<SendFlow />);
    expect(screen.getByText(/Available \$1,842\.60/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Max" }));
    expect(screen.getByLabelText("Amount")).toHaveValue("1842.6");
  });

  it("fills a quick amount, and marks the one picked", async () => {
    render(<SendFlow />);
    const ten = screen.getByRole("button", { name: "$10" });
    expect(ten).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(ten);
    await waitFor(() => expect(screen.getByLabelText("Amount")).toHaveValue("10"));
    expect(screen.getByRole("button", { name: "$10" })).toHaveAttribute("aria-pressed", "true");
  });

  it("turns off quick amounts that are more than the balance", () => {
    balance = { state: { status: "ready", data: { usdc: "7500000" } }, refresh: refreshBalance }; // $7.50
    render(<SendFlow />);
    expect(screen.getByRole("button", { name: "$5" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "$10" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "$50" })).toBeDisabled();
  });

  it("does not offer Max before the balance is known", () => {
    balance = { state: { status: "loading" }, refresh: refreshBalance };
    render(<SendFlow />);
    expect(screen.queryByRole("button", { name: "Max" })).not.toBeInTheDocument();
    expect(screen.getByText("Checking your balance...")).toBeInTheDocument();
  });

  it("says an address looks valid only once it does", () => {
    render(<SendFlow />);
    expect(screen.queryByText(/Looks like a valid Solana address/)).not.toBeInTheDocument();
    type("To", "not-an-address");
    expect(screen.queryByText(/Looks like a valid Solana address/)).not.toBeInTheDocument();
    type("To", ADDRESS);
    expect(screen.getByText(/Looks like a valid Solana address/)).toBeInTheDocument();
  });

  it("only lets numbers and one decimal point into the amount", () => {
    render(<SendFlow />);
    type("Amount", "1a2..3,4.5");
    expect(screen.getByLabelText("Amount")).toHaveValue("12.345");
  });

  it("starts the payment check with the trimmed address and the exact amount text", () => {
    render(<SendFlow />);
    type("To", ADDRESS);
    type("Amount", "10.25");
    fireEvent.submit(screen.getByRole("button", { name: "Review payment" }).closest("form")!);
    expect(prepare).toHaveBeenCalledWith(ADDRESS, "10.25");
  });

  it("does not start a payment from an invalid form", () => {
    render(<SendFlow />);
    fireEvent.submit(screen.getByRole("button", { name: "Review payment" }).closest("form")!);
    expect(prepare).not.toHaveBeenCalled();
  });

  it("shows the backend's reason when a payment is refused", () => {
    sendState = { step: "form", error: "Your daily limit is $200." };
    render(<SendFlow />);
    expect(screen.getByRole("alert")).toHaveTextContent("Your daily limit is $200.");
  });

  it("disables the form while checking", () => {
    sendState = { step: "preparing" };
    render(<SendFlow />);
    expect(screen.getByRole("button", { name: "Checking..." })).toBeDisabled();
    expect(screen.getByLabelText("To")).toBeDisabled();
  });
});

describe("SendFlow: review", () => {
  it("shows the exact amount and the full address before anything is sent", () => {
    sendState = { step: "review", prepared };
    render(<SendFlow />);
    expect(screen.getByText("$10.255")).toBeInTheDocument();
    expect(screen.getByText(ADDRESS)).toBeInTheDocument(); // the whole address, not a shortened one
    expect(screen.getByText(/cannot be reversed/)).toBeInTheDocument();
    expect(screen.getByText("Paid by Kenfi")).toBeInTheDocument();
  });

  it("confirms or goes back", () => {
    sendState = { step: "review", prepared };
    render(<SendFlow />);
    fireEvent.click(screen.getByRole("button", { name: "Confirm and send" }));
    expect(confirm).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(back).toHaveBeenCalledTimes(1);
  });

  it("locks both buttons while waiting to sign", () => {
    sendState = { step: "signing", prepared };
    render(<SendFlow />);
    expect(screen.getByRole("button", { name: "Waiting for confirmation..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
  });
});

describe("SendFlow: result", () => {
  it("says the payment was sent, not complete, while pending", () => {
    sendState = { step: "pending", prepared, signature: "SIG123", note: null };
    render(<SendFlow />);
    expect(screen.getByRole("heading", { name: "Payment sent" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Payment complete" })).not.toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Solana Explorer/ });
    expect(link).toHaveAttribute("href", "https://explorer.solana.com/tx/SIG123");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("shows the note when we could not record the payment", () => {
    sendState = { step: "pending", prepared, signature: "SIG", note: "It will show in History." };
    render(<SendFlow />);
    expect(screen.getByText("It will show in History.")).toBeInTheDocument();
  });

  it("says complete only when confirmed, and can start another", () => {
    sendState = { step: "confirmed", prepared, signature: "SIG123" };
    render(<SendFlow />);
    expect(screen.getByRole("heading", { name: "Payment complete" })).toBeInTheDocument();
    expect(screen.getByText("Confirmed by Solana")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Send another" }));
    expect(reset).toHaveBeenCalled();
    expect(refreshBalance).toHaveBeenCalled();
  });

  it("shows why a payment failed and offers to try again", () => {
    sendState = { step: "failed", prepared, signature: null, message: "The payment failed on Solana." };
    render(<SendFlow />);
    expect(screen.getByRole("alert")).toHaveTextContent("The payment failed on Solana.");
    expect(screen.queryByRole("heading", { name: "Payment complete" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalled();
  });
});
