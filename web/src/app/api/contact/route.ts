import { clientIp, parseEmail, sendContactNote, tooMany } from "@/lib/mail";

function textField(raw: unknown, max: number) {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!value || value.length > max) return null;
  return value;
}

export async function POST(request: Request) {
  if (tooMany(clientIp(request), 6)) {
    return Response.json({ error: "Try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "That note could not be read." }, { status: 400 });
  }

  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  if (typeof payload.website === "string" && payload.website.trim()) {
    return Response.json({ ok: true });
  }

  const name = textField(payload.name, 80);
  const email = parseEmail(payload.email);
  const note = textField(payload.note, 4000);
  if (!name || !email || !note) {
    return Response.json({ error: "Fill in your name, email, and note." }, { status: 400 });
  }

  const result = await sendContactNote({ name, email, note });
  if (!result.ok) {
    return Response.json(
      { error: "Could not send just now. Try again in a moment." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
