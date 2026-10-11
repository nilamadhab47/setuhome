"use client";

import { FormEvent, useState } from "react";

export function WaitlistForm({ dark = false, anchor = false }: { dark?: boolean; anchor?: boolean }) {
  const [joined, setJoined] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "")
      .trim()
      .toLowerCase();
    if (!email.includes("@")) return;
    const key = "setuhome-waitlist";
    const list = JSON.parse(localStorage.getItem(key) || "[]") as string[];
    if (!list.includes(email)) list.push(email);
    localStorage.setItem(key, JSON.stringify(list));
    setJoined(true);
    event.currentTarget.reset();
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
          placeholder="Enter your email address"
          className={
            dark
              ? "min-h-12 flex-1 bg-transparent px-4 text-white outline-none placeholder:text-white/60"
              : "min-h-12 flex-1 bg-transparent px-4 text-ink outline-none placeholder:text-plum"
          }
        />
        <button
          type="submit"
          className="min-h-12 rounded-full bg-marigold px-6 text-sm font-medium text-ink hover:bg-marigold-deep"
        >
          Join the waitlist
        </button>
      </form>
      <p className={`mt-3 text-xs ${dark ? "text-white/75" : "text-plum"}`}>
        {joined
          ? "You're on the list. We'll write when the app is ready."
          : "The app is free. No spam, ever."}
      </p>
    </div>
  );
}
