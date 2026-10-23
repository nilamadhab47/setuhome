"use client";

import { FormEvent, useState } from "react";

export function WaitlistForm({ dark = false, anchor = false }: { dark?: boolean; anchor?: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "joined" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "")
      .trim()
      .toLowerCase();
    if (!email.includes("@")) return;
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          website: String(data.get("website") || ""),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error || "Could not join just now. Try again in a moment.");
        return;
      }
      const key = "setuhome-waitlist";
      const list = JSON.parse(localStorage.getItem(key) || "[]") as string[];
      if (!list.includes(email)) list.push(email);
      localStorage.setItem(key, JSON.stringify(list));
      setStatus("joined");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Could not join just now. Try again in a moment.");
    }
  }

  return (
    <div id={anchor ? "waitlist" : undefined}>
      <form
        onSubmit={onSubmit}
        className={
          dark
            ? "flex flex-col gap-2 rounded-3xl border border-white/20 bg-white/10 p-2 sm:flex-row"
            : "flex flex-col gap-2 rounded-3xl border border-line bg-white p-2 shadow-sm sm:flex-row"
        }
      >
        <label className="sr-only" htmlFor={dark ? "email-dark" : "email"}>
          Email address
        </label>
        <input
          id={dark ? "email-dark" : "email"}
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={status === "sending"}
          placeholder="Enter your email address"
          className={
            dark
              ? "min-h-12 flex-1 bg-transparent px-4 text-white outline-none placeholder:text-white/60 disabled:opacity-60"
              : "min-h-12 flex-1 bg-transparent px-4 text-ink outline-none placeholder:text-plum disabled:opacity-60"
          }
        />
        <div aria-hidden className="hidden">
          <label htmlFor={dark ? "website-dark" : "website"}>Website</label>
          <input id={dark ? "website-dark" : "website"} name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="min-h-12 rounded-full bg-marigold px-6 text-sm font-medium text-ink hover:bg-marigold-deep disabled:opacity-70"
        >
          {status === "sending" ? "Joining…" : "Join the waitlist"}
        </button>
      </form>
      <p className={`mt-3 text-xs ${dark ? "text-white/75" : "text-plum"}`} aria-live="polite">
        {status === "joined"
          ? "You're on the list. We sent a note to that address."
          : status === "error"
            ? message
            : "The app is free. No spam, ever."}
      </p>
    </div>
  );
}
