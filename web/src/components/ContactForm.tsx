"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || ""),
          email: String(data.get("email") || ""),
          note: String(data.get("note") || ""),
          website: String(data.get("website") || ""),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error || "Could not send just now. Try again in a moment.");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Could not send just now. Try again in a moment.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-xl space-y-3">
      <input
        required
        name="name"
        placeholder="Your name"
        autoComplete="name"
        disabled={status === "sending"}
        className="min-h-12 w-full rounded-2xl border border-line bg-white px-4 disabled:opacity-60"
      />
      <input
        required
        type="email"
        name="email"
        placeholder="Email"
        autoComplete="email"
        disabled={status === "sending"}
        className="min-h-12 w-full rounded-2xl border border-line bg-white px-4 disabled:opacity-60"
      />
      <textarea
        required
        name="note"
        rows={5}
        placeholder="Your note"
        disabled={status === "sending"}
        className="w-full rounded-2xl border border-line bg-white px-4 py-3 disabled:opacity-60"
      />
      <div aria-hidden className="hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-marigold px-6 py-3 text-sm font-medium disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>
      {status === "sent" ? <p className="text-sm text-plum">Received. Thank you.</p> : null}
      {status === "error" ? (
        <p className="text-sm text-plum" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
