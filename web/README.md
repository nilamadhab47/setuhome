# setuHome site

Waitlist and legal pages for setuHome, at [setuhome.xyz](https://setuhome.xyz). Next.js in this folder.

```bash
pnpm install
cp .env.example .env.local   # then fill RESEND_API_KEY
pnpm dev
```

Waitlist and contact forms post to `/api/waitlist` and `/api/contact`, which send mail with Resend. The key stays in `.env.local` and is never committed.

Product context, app setup, sources, and licence are in the [root README](../README.md).
