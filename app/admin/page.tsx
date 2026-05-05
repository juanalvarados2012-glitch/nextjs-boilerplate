"use client";
import { useState } from "react";

const GOLD = "#C4975A";
const BG = "#070809";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<{ email: string; date: string; amount: string; currency: string }[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  async function login() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) { setError("Wrong password."); setLoading(false); return; }
      const data = await res.json();
      setCustomers(data.customers);
      setTotal(data.total);
      setAuthed(true);
    } catch {
      setError("Something went wrong.");
    }
    setLoading(false);
  }

  const filtered = customers.filter(c => c.email.toLowerCase().includes(search.toLowerCase()));

  if (!authed) {
    return (
      <div style={{ background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} body{background:#070809;}`}</style>
        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "16px", padding: "48px 40px", width: "100%", maxWidth: "380px", textAlign: "center" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `${GOLD}18`, border: `1px solid ${GOLD}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "20px" }}>🔒</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "24px", color: "#EDE5D4", marginBottom: "6px" }}>Admin Panel</h1>
          <p style={{ color: "#555", fontSize: "13px", marginBottom: "28px" }}>BrandMind · Customers</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            placeholder="Enter admin password"
            autoFocus
            style={{ width: "100%", padding: "12px 16px", fontSize: "14px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "8px", color: "#fff", outline: "none", fontFamily: "'DM Sans',sans-serif", marginBottom: "10px" }}
          />
          {error && <p style={{ color: "#e05c5c", fontSize: "12px", marginBottom: "10px" }}>{error}</p>}
          <button
            onClick={login}
            disabled={loading || !password}
            style={{ width: "100%", padding: "12px", background: `linear-gradient(135deg,${GOLD},#E8C98A,${GOLD})`, color: "#0a0806", fontWeight: "700", border: "none", borderRadius: "8px", fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", opacity: loading || !password ? 0.6 : 1 }}
          >
            {loading ? "Verifying…" : "Enter"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: "#fff" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} body{background:#070809;} ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:#1e1e1e;}`}</style>

      <div style={{ borderBottom: "1px solid rgba(255,255,255,.05)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "16px", color: "#EDE5D4", fontWeight: "700" }}>BrandMind</span>
          <span style={{ color: "#333", margin: "0 8px" }}>·</span>
          <span style={{ color: "#555", fontSize: "13px" }}>Admin</span>
        </div>
        <button onClick={() => { setAuthed(false); setPassword(""); }} style={{ background: "none", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", color: "#555", fontSize: "12px", padding: "6px 12px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Sign out</button>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ color: GOLD, fontSize: "10px", letterSpacing: ".2em", fontWeight: "700", marginBottom: "6px" }}>CUSTOMERS</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "32px", color: "#EDE5D4" }}>
              {total} <span style={{ fontSize: "16px", color: "#555", fontFamily: "'DM Sans',sans-serif", fontWeight: "400" }}>total purchases</span>
            </h2>
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email…"
            style={{ padding: "10px 14px", fontSize: "13px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "8px", color: "#fff", outline: "none", fontFamily: "'DM Sans',sans-serif", width: "220px" }}
          />
        </div>

        <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 100px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
            <span style={{ color: "#333", fontSize: "11px", letterSpacing: ".1em", fontWeight: "600" }}>EMAIL</span>
            <span style={{ color: "#333", fontSize: "11px", letterSpacing: ".1em", fontWeight: "600" }}>DATE</span>
            <span style={{ color: "#333", fontSize: "11px", letterSpacing: ".1em", fontWeight: "600", textAlign: "right" }}>AMOUNT</span>
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "#333", fontSize: "13px" }}>
              {search ? "No customers match that search." : "No purchases yet."}
            </div>
          ) : (
            filtered.map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 140px 100px", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none", alignItems: "center" }}>
                <span style={{ color: "#ccc", fontSize: "13px" }}>{c.email}</span>
                <span style={{ color: "#555", fontSize: "12px" }}>{c.date}</span>
                <span style={{ color: GOLD, fontSize: "13px", fontWeight: "600", textAlign: "right" }}>${c.amount} <span style={{ color: "#444", fontSize: "10px", fontWeight: "400" }}>{c.currency}</span></span>
              </div>
            ))
          )}
        </div>

        {filtered.length > 0 && filtered.length !== total && (
          <p style={{ color: "#444", fontSize: "12px", marginTop: "12px", textAlign: "center" }}>Showing {filtered.length} of {total}</p>
        )}
      </div>
    </div>
  );
}
