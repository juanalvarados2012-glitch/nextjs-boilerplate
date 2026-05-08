export function buildWelcomeEmail(email: string): { subject: string; html: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://brandmind.app";
  const GOLD = "#C4975A";

  const subject = "✦ Your BrandMind Pro access is active";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#070809;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070809;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <div style="display:inline-block;border:1px solid ${GOLD}40;border-radius:100px;padding:6px 18px;margin-bottom:20px;">
            <span style="color:${GOLD};font-size:11px;font-weight:700;letter-spacing:.2em;">BRANDMIND PRO</span>
          </div>
          <h1 style="color:#EDE5D4;font-size:32px;font-weight:900;margin:0 0 10px;font-family:Georgia,serif;">
            Your brand kit is ready.
          </h1>
          <p style="color:#666;font-size:15px;margin:0;line-height:1.7;">
            You now have full access to BrandMind Pro — forever.
          </p>
        </td></tr>

        <!-- Main card -->
        <tr><td style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:32px;">

          <p style="color:#999;font-size:14px;margin:0 0 24px;line-height:1.8;">
            Hey 👋 — Thank you for your purchase! Here's everything you unlocked:
          </p>

          ${[
            ["✦", "Brand identity", "Logo in 5 styles, color palette, typography"],
            ["📝", "3 tagline options", "Crafted for your brand voice"],
            ["📱", "6 Instagram posts", "Hook, caption & hashtags ready to post"],
            ["🌐", "Website copy", "Hero, about, services & social proof"],
            ["🎬", "3 Reel scripts", "Hook, body and CTA for each"],
            ["✏️", "Platform bios", "Instagram, TikTok, LinkedIn & Twitter"],
            ["💾", "Save up to 10 kits", "Generate and save multiple brand kits"],
          ].map(([icon, title, desc]) => `
          <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
            <span style="font-size:18px;flex-shrink:0;margin-top:2px;">${icon}</span>
            <div>
              <span style="color:#EDE5D4;font-size:14px;font-weight:600;">${title}</span>
              <span style="color:#555;font-size:13px;"> — ${desc}</span>
            </div>
          </div>`).join("")}

          <!-- CTA -->
          <div style="text-align:center;margin:32px 0 8px;">
            <a href="${appUrl}" style="display:inline-block;background:linear-gradient(135deg,${GOLD},#E8C98A,${GOLD});color:#0a0806;font-weight:700;font-size:15px;padding:16px 40px;border-radius:10px;text-decoration:none;">
              ✦ Go to BrandMind →
            </a>
          </div>
          <p style="color:#444;font-size:12px;text-align:center;margin:12px 0 0;">
            Sign in with this email: <strong style="color:#666;">${email}</strong>
          </p>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:28px;text-align:center;">
          <p style="color:#333;font-size:12px;margin:0 0 6px;">
            Questions? Reply to this email or contact
            <a href="mailto:juanalvarados2012@gmail.com" style="color:${GOLD};text-decoration:none;">juanalvarados2012@gmail.com</a>
          </p>
          <p style="color:#222;font-size:11px;margin:0;">
            BrandMind · One-time payment · No subscriptions
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html };
}
