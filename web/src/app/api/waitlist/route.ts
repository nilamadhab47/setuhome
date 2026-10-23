import { clientIp, joinWaitlist, parseEmail, tooMany } from "@/lib/mail";

export async function POST(request: Request) {
  if (tooMany(clientIp(request))) {
    return Response.json({ error: "Try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "That address could not be read." }, { status: 400 });
  }

  const payload = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  if (typeof payload.website === "string" && payload.website.trim()) {
    return Response.json({ ok: true });
  }

  const email = parseEmail(payload.email);
  if (!email) {
    return Response.json({ error: "Enter a working email address." }, { status: 400 });
  }

  const result = await joinWaitlist(email);
  if (!result.ok) {
    return Response.json(
      { error: "Could not join just now. Try again in a moment." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
