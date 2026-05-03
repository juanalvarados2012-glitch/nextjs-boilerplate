const GOLD = "#C4975A";
const BG = "#070809";

export default function PrivacyPolicy() {
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
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,5vw,52px)", color: "#EDE5D4", marginBottom: "12px" }}>Privacy Policy</h1>
        <p style={{ color: "#444", fontSize: "13px", marginBottom: "48px" }}>Effective: May 2026</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Who We Are</h2>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.85" }}>
              BrandMind is an AI-powered brand identity platform. We are operated independently and can be reached at <a href="mailto:juanalvarados2012@gmail.com" style={{ color: GOLD, textDecoration: "none" }}>juanalvarados2012@gmail.com</a>. This policy explains what data we collect, why, and how we protect it.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Data We Collect</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { title: "Email address", desc: "Collected when you sign in or complete a purchase. Used to verify your Pro access and send important account updates." },
                { title: "Payment information", desc: "Processed entirely by Stripe. We never store your card number, CVV, or bank details — Stripe handles all payment data securely." },
                { title: "Brand inputs", desc: "The brand name, industry, values, audience, and style you enter in the generator. Used solely to generate your brand kit." },
                { title: "Usage data", desc: "Anonymous data such as pages visited and features used, collected to improve the platform. No personal identifiers attached." },
              ].map((item, i) => (
                <div key={i} style={{ padding: "16px", background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", borderRadius: "10px" }}>
                  <p style={{ color: "#EDE5D4", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>{item.title}</p>
                  <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.7" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>How We Use Your Data</h2>
            <ul style={{ color: "#777", fontSize: "14px", lineHeight: "2.1", paddingLeft: "20px" }}>
              <li>To verify your Pro account status and grant access to premium features.</li>
              <li>To generate your brand identity using AI models.</li>
              <li>To process and confirm your payment via Stripe.</li>
              <li>To respond to support or refund requests.</li>
              <li>To improve the platform based on usage patterns.</li>
            </ul>
            <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.85", marginTop: "12px" }}>We do <strong style={{ color: "#aaa" }}>not</strong> sell your data to third parties, use it for advertising, or share it with anyone other than the service providers listed below.</p>
          </section>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Third-Party Services</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { name: "Stripe", purpose: "Payment processing. Subject to Stripe's Privacy Policy.", url: "https://stripe.com/privacy" },
                { name: "Groq / AI Provider", purpose: "Processes your brand inputs to generate text-based brand kits. Inputs are not stored beyond the generation request." },
                { name: "Vercel", purpose: "Hosts the platform. May collect standard server logs (IP address, request metadata)." },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", padding: "12px 14px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: "8px" }}>
                  <span style={{ color: GOLD, fontSize: "13px", fontWeight: "700", minWidth: "90px" }}>{s.name}</span>
                  <span style={{ color: "#666", fontSize: "13px", lineHeight: "1.6" }}>{s.purpose}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Data Storage & Security</h2>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.85" }}>
              Your generated brand kits are stored locally in your browser (localStorage) and are not uploaded to our servers. Your email is stored securely to verify Pro access. We use HTTPS encryption for all data transmitted to and from the platform.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Your Rights (GDPR / CCPA)</h2>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.85", marginBottom: "12px" }}>Depending on your location, you may have the right to:</p>
            <ul style={{ color: "#777", fontSize: "14px", lineHeight: "2.1", paddingLeft: "20px" }}>
              <li>Access the personal data we hold about you.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Opt out of any non-essential data collection.</li>
              <li>Receive a copy of your data in a portable format.</li>
            </ul>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.85", marginTop: "12px" }}>
              To exercise any of these rights, email <a href="mailto:juanalvarados2012@gmail.com" style={{ color: GOLD, textDecoration: "none" }}>juanalvarados2012@gmail.com</a> and we will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Cookies</h2>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.85" }}>
              BrandMind does not use tracking or advertising cookies. We use localStorage to save your session and generated brand kits on your device only.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Changes to This Policy</h2>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.85" }}>
              We may update this policy occasionally. Significant changes will be communicated via email to registered users. Continued use of BrandMind after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#EDE5D4", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Contact</h2>
            <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.85" }}>
              For any privacy-related questions: <a href="mailto:juanalvarados2012@gmail.com" style={{ color: GOLD, textDecoration: "none" }}>juanalvarados2012@gmail.com</a>
            </p>
          </section>

        </div>
      </div>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,.04)", padding: "20px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/privacy" style={{ color: GOLD, fontSize: "11px", textDecoration: "none" }}>Privacy Policy</a>
          <a href="/terms" style={{ color: "#444", fontSize: "11px", textDecoration: "none" }}>Terms of Service</a>
          <a href="/refund" style={{ color: "#444", fontSize: "11px", textDecoration: "none" }}>Refund Policy</a>
        </div>
      </footer>
    </div>
  );
}
