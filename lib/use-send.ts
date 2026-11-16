"use client";

import { useSignAndSendTransaction, useWallets } from "@privy-io/react-auth/solana";
import { useCallback, useEffect, useRef, useState } from "react";
import { describeError } from "./errors";
import {
  base64ToBytes,
  signatureToBase58,
  type PreparedSend,
  type SendStatusData,
} from "./send";
import { useAuth } from "./use-auth";

export type SendState =
  | { step: "form"; error: string | null }
  | { step: "preparing" }
  | { step: "review"; prepared: PreparedSend }
  | { step: "signing"; prepared: PreparedSend }
  | { step: "pending"; prepared: PreparedSend; signature: string; note: string | null }
  | { step: "confirmed"; prepared: PreparedSend; signature: string }
  | { step: "failed"; prepared: PreparedSend | null; signature: string | null; message: string };

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 40; // two minutes
const REPORT_RETRIES = 3;
const REPORT_RETRY_MS = 1500;

const INITIAL: SendState = { step: "form", error: null };

function isUserCancel(error: unknown): boolean {
  const text = error instanceof Error ? error.message.toLowerCase() : "";
  return /reject|cancel|denied|closed|dismiss/.test(text);
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * The whole Send flow:
 *   prepare  -> the backend checks the payment and builds the transaction
 *   review   -> the user checks it
 *   confirm  -> Privy signs and sends it (Kenfi pays the network fee)
 *   report   -> tell the backend the signature
 *   poll     -> wait until Solana confirms it, or says it failed
 *
 * A payment is only ever "confirmed" because the backend saw Solana confirm it.
 */
export function useSend() {
  const { callBackend } = useAuth();
  const { wallets } = useWallets();
  const { signAndSendTransaction } = useSignAndSendTransaction();

  const [state, setState] = useState<SendState>(INITIAL);
  const mounted = useRef(true);
  // Bumped on reset so a poll from an earlier payment cannot change a new one.
  const run = useRef(0);
  // Stops a double-click from signing the same payment twice before React re-renders.
  const busy = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const set = useCallback((next: SendState, runId?: number) => {
    if (!mounted.current) return;
    if (runId !== undefined && runId !== run.current) return;
    setState(next);
  }, []);

  const prepare = useCallback(
    async (to: string, amount: string) => {
      const runId = ++run.current;
      busy.current = false;
      set({ step: "preparing" }, runId);
      try {
        const prepared = await callBackend<PreparedSend>("/wallet/send/prepare", {
          method: "POST",
          body: { to_address: to.trim(), amount },
        });
        set({ step: "review", prepared }, runId);
      } catch (error) {
        set({ step: "form", error: describeError(error) }, runId);
      }
    },
    [callBackend, set],
  );

  const track = useCallback(
    async (prepared: PreparedSend, signature: string, runId: number) => {
      // Tell the backend. The money is already on its way, so a failure here
      // must never turn into a failed payment.
      let recorded = false;
      for (let attempt = 0; attempt < REPORT_RETRIES && !recorded; attempt++) {
        try {
          await callBackend<SendStatusData>(`/wallet/send/${prepared.send_id}/submitted`, {
            method: "POST",
            body: { signature },
          });
          recorded = true;
        } catch {
          if (attempt < REPORT_RETRIES - 1) await wait(REPORT_RETRY_MS);
        }
        if (runId !== run.current || !mounted.current) return;
      }

      const note = recorded
        ? null
        : "We could not save this payment yet. It will show in History once Solana confirms it.";
      set({ step: "pending", prepared, signature, note }, runId);
      if (!recorded) return;

      for (let attempt = 0; attempt < POLL_MAX_ATTEMPTS; attempt++) {
        await wait(POLL_INTERVAL_MS);
        if (runId !== run.current || !mounted.current) return;

        try {
          const status = await callBackend<SendStatusData>(`/wallet/send/${prepared.send_id}`);
          if (status.status === "confirmed") {
            set({ step: "confirmed", prepared, signature }, runId);
            return;
          }
          if (status.status === "failed") {
            set(
              {
                step: "failed",
                prepared,
                signature,
                message: status.error ?? "The payment failed.",
              },
              runId,
            );
            return;
          }
        } catch {
          // A single failed check is fine. Keep waiting.
        }
      }

      set(
        {
          step: "pending",
          prepared,
          signature,
          note: "This is taking longer than usual. Check History for the final result.",
        },
        runId,
      );
    },
    [callBackend, set],
  );

  const confirm = useCallback(async () => {
    if (state.step !== "review" || busy.current) return;
    busy.current = true;
    const { prepared } = state;
    const runId = run.current;

    if (Date.now() > Date.parse(prepared.expires_at)) {
      busy.current = false;
      set({ step: "form", error: "This payment expired. Please start again." }, runId);
      return;
    }

    const wallet = wallets[0];
    if (!wallet) {
      busy.current = false;
      set(
        {
          step: "failed",
          prepared,
          signature: null,
          message: "Your wallet is not ready yet. Please try again in a moment.",
        },
        runId,
      );
      return;
    }

    set({ step: "signing", prepared }, runId);

    let signature: string;
    try {
      const result = await signAndSendTransaction({
        transaction: base64ToBytes(prepared.transaction),
        wallet,
        options: { sponsor: true },
      });
      signature = signatureToBase58(result.signature);
    } catch (error) {
      busy.current = false;
      if (isUserCancel(error)) {
        set({ step: "review", prepared }, runId);
        return;
      }
      set(
        {
          step: "failed",
          prepared,
          signature: null,
          message: "We could not send this payment. Check History before trying again.",
        },
        runId,
      );
      return;
    }

    await track(prepared, signature, runId);
  }, [state, wallets, signAndSendTransaction, set, track]);

  /** Go back from the review screen to the form, keeping what was typed. */
  const back = useCallback(() => {
    run.current++;
    busy.current = false;
    set({ step: "form", error: null });
  }, [set]);

  /** Start over. */
  const reset = useCallback(() => {
    run.current++;
    busy.current = false;
    set(INITIAL);
  }, [set]);

  return { state, prepare, confirm, back, reset };
}
