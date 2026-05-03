const GOLD = "#C4975A";
const BG = "#070809";

export default function RefundPolicy() {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#fff", fontFamily: "Arial, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      `}</style>

      <nav style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ fontFamily: "'Playfair Display',serif", color: GOLD, fontSize: "16px", fontWeight: "700", textDecoration: "none" }}>BrandMind</a>
        <a href="/" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>← Back to Home</a>
      </nav>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 100px" }}>
        <p style={{ color: GOLD, fontSize: "10px", letterSpacing: ".22em", fontWeight: "700", marginBottom: "12px" }}>LEGAL</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,5vw,52px)", color: "#EDE5D4", marginBottom: "12px" }}>Refund Policy</h1>
        <p style={{ color: "#444", fontSize: "13px", marginBottom: "48px" }}>Effective: May 2026</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Overview</h2>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.85" }}>
              BrandMind offers a one-time payment of $49 for lifetime access to the platform. Because our product delivers AI-generated digital content instantly upon purchase, we evaluate refund requests carefully and on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Eligibility for a Refund</h2>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.85", marginBottom: "12px" }}>You may request a refund within <span style={{ color: GOLD }}>7 days of purchase</span> if:</p>
            <ul style={{ color: "#777", fontSize: "14px", lineHeight: "2", paddingLeft: "20px" }}>
              <li>The platform failed to generate your brand kit due to a technical error on our end.</li>
              <li>You were charged more than once for the same order.</li>
              <li>You did not receive access to the product after payment was confirmed.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Non-Refundable Cases</h2>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.85", marginBottom: "12px" }}>Refunds will <strong style={{ color: "#aaa" }}>not</strong> be issued if:</p>
            <ul style={{ color: "#777", fontSize: "14px", lineHeight: "2", paddingLeft: "20px" }}>
              <li>You have already generated and downloaded your brand kit.</li>
              <li>You changed your mind after the content was generated.</li>
              <li>The AI output did not match your subjective expectations (all generations are unique and AI-dependent).</li>
              <li>More than 7 days have passed since your purchase.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>How to Request a Refund</h2>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.85" }}>
              Send an email to <a href="mailto:juanalvarados2012@gmail.com" style={{ color: GOLD, textDecoration: "none" }}>juanalvarados2012@gmail.com</a> with the subject line <span style={{ color: "#aaa" }}>"Refund Request"</span>, including your purchase email and a brief description of the issue. We will respond within 3 business days.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Processing</h2>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.85" }}>
              Approved refunds are processed through Stripe and typically appear on your original payment method within 5–10 business days, depending on your bank.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Contact</h2>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.85" }}>
              Questions? Email us at <a href="mailto:juanalvarados2012@gmail.com" style={{ color: GOLD, textDecoration: "none" }}>juanalvarados2012@gmail.com</a>
            </p>
          </section>

        </div>
      </div>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,.04)", padding: "20px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/privacy" style={{ color: "#444", fontSize: "11px", textDecoration: "none" }}>Privacy Policy</a>
          <a href="/terms" style={{ color: "#444", fontSize: "11px", textDecoration: "none" }}>Terms of Service</a>
          <a href="/refund" style={{ color: GOLD, fontSize: "11px", textDecoration: "none" }}>Refund Policy</a>
        </div>
      </footer>
    </div>
  );
}
