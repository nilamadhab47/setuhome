"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-xl space-y-3">
      <input
        required
        name="name"
        placeholder="Your name"
        className="min-h-12 w-full rounded-2xl border border-line bg-white px-4"
      />
      <input
        required
        type="email"
        name="email"
        placeholder="Email"
        className="min-h-12 w-full rounded-2xl border border-line bg-white px-4"
      />
      <textarea
        required
        name="note"
        rows={5}
        placeholder="Your note"
        className="w-full rounded-2xl border border-line bg-white px-4 py-3"
      />
      <button type="submit" className="rounded-full bg-marigold px-6 py-3 text-sm font-medium">
        Send
      </button>
      {sent ? <p className="text-sm text-plum">Received on this device. Thank you.</p> : null}
    </form>
  );
}
