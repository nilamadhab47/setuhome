import { SITE_NAME, SITE_URL } from "@/lib/site";

export const inviteSubject = "You're on the SetuHome list";

export const inviteText = `You're on the SetuHome list.

We'll write when the iPhone and Android app is ready, before Diwali. A verse each morning, festival days for your city, and stories at home.

The app is free. No subscription, no ads, no spam.

${SITE_URL}
`;

export function inviteHtml(imageSrc: string) {
  const sans = "'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
  const serif = "'EB Garamond',Georgia,'Times New Roman',serif";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${inviteSubject}</title>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=EB+Garamond:ital,wght@0,500;0,600;1,500&family=Noto+Serif+Devanagari:wght@500&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background:#F3EBE0;color:#1E1B3A;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      A verse each morning, festival days for your city, and stories at home.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3EBE0;padding:28px 12px 40px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#FBF6EE;border:1px solid #EADFCF;border-radius:28px;overflow:hidden;">
            <tr>
              <td style="padding:22px 28px 16px;text-align:center;">
                <p style="margin:0;font-family:${sans};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C4842F;font-weight:600;">${SITE_NAME}</p>
                <p style="margin:6px 0 0;font-family:'Noto Serif Devanagari',${serif};font-size:18px;color:#6B6577;">सेतु</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 12px;">
                <img src="${imageSrc}" alt="Dawn over a camp, a chariot against the sun" width="576" style="display:block;width:100%;max-width:576px;height:auto;border:0;border-radius:18px;" />
              </td>
            </tr>
            <tr>
              <td style="padding:28px 36px 8px;text-align:center;">
                <p style="margin:0;font-family:${sans};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#E8A33D;font-weight:600;">Coming this Diwali</p>
                <h1 style="margin:12px 0 0;font-family:${serif};font-size:40px;line-height:1.12;font-weight:500;color:#1E1B3A;">You're on the list.</h1>
                <p style="margin:16px 0 0;font-family:${serif};font-size:20px;line-height:1.45;color:#6B6577;font-style:italic;">The verse, at home.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 40px 0;">
                <p style="margin:0;font-family:${sans};font-size:16px;line-height:1.65;color:#6B6577;text-align:center;">
                  We'll write when the iPhone and Android app is ready. A verse each morning from the Gita or the Ramayana, festival days for your city, and stories at the end of the day.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:28px 36px 8px;">
                <a href="${SITE_URL}" style="display:inline-block;background:#E8A33D;color:#1E1B3A;text-decoration:none;padding:14px 28px;border-radius:999px;font-family:${sans};font-size:15px;font-weight:600;">Visit SetuHome</a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #EADFCF;border-radius:18px;">
                  <tr>
                    <td style="padding:22px 24px;text-align:center;">
                      <p style="margin:0;font-family:'Noto Serif Devanagari',${serif};font-size:22px;line-height:1.7;color:#1E1B3A;">कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।</p>
                      <p style="margin:10px 0 0;font-family:${serif};font-size:15px;font-style:italic;color:#6B6577;">karmaṇy-evādhikāras te mā phaleṣu kadācana</p>
                      <p style="margin:10px 0 0;font-family:${sans};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#C4842F;font-weight:600;">Bhagavad Gita 2.47</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="33%" valign="top" style="padding:8px;text-align:center;">
                      <p style="margin:0;font-family:${serif};font-size:18px;color:#1E1B3A;">Verse</p>
                      <p style="margin:6px 0 0;font-family:${sans};font-size:13px;line-height:1.45;color:#6B6577;">Sanskrit, a sourced English line, and everyday words.</p>
                    </td>
                    <td width="33%" valign="top" style="padding:8px;text-align:center;">
                      <p style="margin:0;font-family:${serif};font-size:18px;color:#1E1B3A;">Festivals</p>
                      <p style="margin:6px 0 0;font-family:${sans};font-size:13px;line-height:1.45;color:#6B6577;">Days and clocks for the city you live in.</p>
                    </td>
                    <td width="33%" valign="top" style="padding:8px;text-align:center;">
                      <p style="margin:0;font-family:${serif};font-size:18px;color:#1E1B3A;">Stories</p>
                      <p style="margin:6px 0 0;font-family:${sans};font-size:13px;line-height:1.45;color:#6B6577;">Little Setu at bedtime. Kids’ mode collects nothing.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 36px 32px;text-align:center;">
                <p style="margin:0;font-family:${sans};font-size:13px;line-height:1.55;color:#6B6577;">The app is free. No subscription, no ads, no spam.</p>
                <p style="margin:16px 0 0;font-family:${serif};font-size:13px;color:#C4842F;">शान्तिः शान्तिः शान्तिः</p>
                <p style="margin:10px 0 0;font-family:${sans};font-size:12px;color:#9A93A3;">
                  <a href="${SITE_URL}" style="color:#6B6577;text-decoration:underline;">setuhome.xyz</a>
                  ·
                  <a href="${SITE_URL}/privacy" style="color:#6B6577;text-decoration:underline;">Privacy</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
