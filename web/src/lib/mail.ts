import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Resend } from "resend";
import { inviteHtml, inviteSubject, inviteText } from "@/emails/invite";
import { SITE_URL } from "@/lib/site";

export function parseEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length < 5 || email.length > 254) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function fromAddress() {
  const raw = process.env.RESEND_FROM?.trim() || "SetuHome <hello@setuhome.xyz>";
  return raw.replace(/^"(.*)"$/, "$1");
}

function client() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

const hits = new Map<string, number[]>();

export function tooMany(ip: string, limit = 8, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > limit;
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "local";
  return request.headers.get("x-real-ip") || "local";
}

async function dawnImage() {
  const hosted = `${SITE_URL}/email/dawn.jpg`;
  try {
    const content = await readFile(join(process.cwd(), "public/email/dawn.jpg"));
    return {
      src: "cid:dawn",
      attachments: [
        {
          content,
          filename: "dawn.jpg",
          contentId: "dawn",
          contentType: "image/jpeg",
        },
      ],
    };
  } catch {
    return { src: hosted, attachments: undefined };
  }
}

export async function joinWaitlist(email: string) {
  const resend = client();
  if (!resend) return { ok: false as const, reason: "mail-unconfigured" };

  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (audienceId) {
    try {
      await resend.contacts.create({ audienceId, email, unsubscribed: false });
    } catch {
      // Duplicate or a list error should not block the invite.
    }
  }

  const dawn = await dawnImage();
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: email,
    replyTo: process.env.WAITLIST_NOTIFY_TO || undefined,
    subject: inviteSubject,
    html: inviteHtml(dawn.src),
    text: inviteText,
    attachments: dawn.attachments,
    tags: [{ name: "kind", value: "waitlist-invite" }],
  });

  if (error) return { ok: false as const, reason: "send-failed" };

  const notify = process.env.WAITLIST_NOTIFY_TO?.trim();
  if (notify && notify !== email) {
    await resend.emails.send({
      from: fromAddress(),
      to: notify,
      subject: `Waitlist: ${email}`,
      text: `${email} joined the SetuHome waitlist.`,
      tags: [{ name: "kind", value: "waitlist-notify" }],
    });
  }

  return { ok: true as const };
}

export async function sendContactNote(input: { name: string; email: string; note: string }) {
  const resend = client();
  if (!resend) return { ok: false as const, reason: "mail-unconfigured" };

  const notify = process.env.WAITLIST_NOTIFY_TO?.trim();
  if (!notify) return { ok: false as const, reason: "mail-unconfigured" };

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: notify,
    replyTo: input.email,
    subject: `Note from ${input.name}`,
    text: `From: ${input.name} <${input.email}>\n\n${input.note}`,
    tags: [{ name: "kind", value: "contact" }],
  });

  if (error) return { ok: false as const, reason: "send-failed" };
  return { ok: true as const };
}
