"use client";
import { useState, useEffect, useCallback } from "react";

const GOLD = "#C4975A";
const GOLDB = "#E8C98A";
const BG = "#070809";
const STRIPE = "https://buy.stripe.com/cNi7sN9iBfwQ7VG1HU4Vy03";
const goBuy = () => window.open(STRIPE, "_blank");

async function callGroq(prompt: string): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  return data.text || "";
}

async function callAI(prompt: string): Promise<any> {
  const text = await callGroq(prompt);
  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("no json");
  return JSON.parse(match[0]);
}

export default function Home() {
  const [view, setView] = useState("landing");
  const [form, setForm] = useState<any>(null);
  const [kit, setKit] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);

  const verifyPremium = useCallback(async (email: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/check-premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      const data = await res.json();
      if (data.premium) {
        setIsPremium(true);
        localStorage.setItem("brandmind_premium_email", email.toLowerCase().trim());
      }
      return !!data.premium;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const success = params.get("success");
    if (success === "true" && email) {
      window.history.replaceState({}, "", "/");
      verifyPremium(email);
    } else {
      const saved = localStorage.getItem("brandmind_premium_email");
      if (saved) verifyPremium(saved);
    }
  }, [verifyPremium]);

  const generate = async (data: any) => {
    setForm(data);
    setView("loading");
    const prompt = `You are a senior brand strategist. Design a complete brand identity.
Brand: ${data.name} | Industry: ${data.industry} | Values: ${data.values.join(", ")} | Audience: ${data.audience} | Style: ${data.style}
Return ONLY raw JSON, no markdown:
{"taglines":["max 7 words","option 2","option 3"],"colors":[{"name":"Primary","hex":"#XXXXXX","role":"Primary"},{"name":"Secondary","hex":"#XXXXXX","role":"Secondary"},{"name":"Accent","hex":"#XXXXXX","role":"Accent"},{"name":"Light","hex":"#XXXXXX","role":"Light"},{"name":"Dark","hex":"#XXXXXX","role":"Dark"}],"typography":{"display":{"name":"Google Font","description":"Use for headlines"},"body":{"name":"Google Font","description":"Use for body"}},"brandVoice":"2-3 sentences","brandStory":"2-3 sentences"}
RULES: Real hex codes only. Real Google Font names only.`;
    try {
      const parsed = await callAI(prompt);
      if (!parsed.colors || !parsed.taglines) throw new Error("incomplete");
      setKit(parsed);
    } catch (e) {
      setKit(buildFallback(data));
    } finally {
      setView("results");
    }
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#070809;color:#fff;font-family:'DM Sans',sans-serif;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes spin2{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .g{background:linear-gradient(135deg,#C4975A 0%,#E8C98A 52%,#C4975A 100%);background-size:250% 100%;color:#0a0806;font-weight:700;border:none;border-radius:8px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .3s ease;}
        .g:hover{background-position:right center;box-shadow:0 8px 32px #C4975A44;transform:translateY(-2px);}
        .o{background:transparent;color:#888;border:1px solid #1e1e1e;cursor:pointer;font-family:'DM Sans',sans-serif;border-radius:8px;transition:all .2s;}
        .o:hover{border-color:#383838;color:#ccc;}
        .card{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);border-radius:12px;}
        .card-g{background:linear-gradient(135deg,rgba(196,151,90,.07),rgba(196,151,90,.02));border:1px solid rgba(196,151,90,.15);border-radius:12px;}
        input,textarea{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;color:#fff;width:100%;outline:none;}
        input:focus,textarea:focus{border-color:#C4975A50;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#1e1e1e;}
      `}</style>

      {view === "landing" && <Landing onStart={() => setView("generator")} />}
      {view === "generator" && <Generator onBack={() => setView("landing")} onGenerate={generate} />}
      {view === "loading" && <LoadingScreen />}
      {view === "results" && kit && <Results kit={kit} form={form} onRestart={() => { setKit(null); setForm(null); setView("landing"); }} callAI={callAI} isPremium={isPremium} onVerifyPremium={verifyPremium} />}
    </div>
  );
}

const INDUSTRIES = ["Tech & Software","E-commerce","Food & Beverage","Health & Wellness","Finance","Education","Real Estate","Fashion","Creative Agency","Consulting","Beauty & Cosmetics","Photography","Fitness","Music","Legal","Architecture","Events","Non-profit","Sports","Travel"];
const VALUES = ["Innovation","Trust","Sustainability","Luxury","Accessibility","Community","Performance","Authenticity","Elegance","Boldness","Quality","Creativity","Passion","Excellence","Impact","Integrity","Growth","Simplicity","Joy","Power"];
const STYLES = [
  {id:"modern",icon:"⚡",label:"Modern & Bold",desc:"Sharp geometry, tech energy"},
  {id:"classic",icon:"🏛",label:"Classic & Elegant",desc:"Heritage, authority, trust"},
  {id:"playful",icon:"✦",label:"Playful & Warm",desc:"Friendly, human, approachable"},
  {id:"luxury",icon:"◆",label:"Luxury & Refined",desc:"Hairline precision, exclusivity"},
  {id:"minimal",icon:"▪",label:"Swiss Minimal",desc:"Grid discipline, pure function"},
];
const STEP_LABELS = ["Brand Name","Industry","Values","Audience","Style"];
const LOAD_MSGS = ["Analyzing your brand…","Building your identity…","Crafting your voice…","Designing your palette…","Finalizing your kit…"];
const TESTIMONIALS = [
  {name:"Sofia R.",role:"Founder, Lumé Studio",text:"Generated my entire brand in 4 minutes. The color palette was exactly what I had in mind.",stars:5},
  {name:"Marcus T.",role:"E-commerce, Forge Co.",text:"The 30 posts alone saved me 6 hours this week. Every caption sounds like me, not a robot.",stars:5},
  {name:"Priya K.",role:"Health & Wellness Coach",text:"I've paid agencies $2,000 for less. This is genuinely the best $49 I've spent.",stars:5},
];

function MiniLogo({ L, color, style, size }: any) {
  const c = color; const s = size;
  if (style === "modern") return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <path d="M0 0 L80 0 L100 20 L100 100 L0 100 Z" fill={c} fillOpacity=".12"/>
      <rect x="0" y="0" width="60" height="6" fill={c} fillOpacity=".9"/>
      <text x="48" y="76" textAnchor="middle" fill={c} fontSize="62" fontFamily="Arial Black,sans-serif" fontWeight="900">{L}</text>
    </svg>
  );
  if (style === "classic") return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="47" fill="none" stroke={c} strokeWidth="1.2" strokeOpacity=".5"/>
      <circle cx="50" cy="50" r="41" fill={c} fillOpacity=".07"/>
      <text x="50" y="65" textAnchor="middle" fill={c} fontSize="46" fontFamily="Georgia,serif" fontWeight="700" fontStyle="italic">{L}</text>
    </svg>
  );
  if (style === "playful") return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <rect x="12" y="12" width="76" height="76" rx="24" fill={c} fillOpacity=".92"/>
      <text x="50" y="66" textAnchor="middle" fill="#fff" fontSize="44" fontFamily="Georgia,serif" fontWeight="700">{L}</text>
    </svg>
  );
  if (style === "luxury") return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" fill="#12100C"/>
      <rect x="6" y="6" width="88" height="88" fill="none" stroke={c} strokeWidth=".7" strokeOpacity=".4"/>
      <line x1="6" y1="6" x2="20" y2="6" stroke={c} strokeWidth="2.2" strokeOpacity=".8"/>
      <line x1="6" y1="6" x2="6" y2="20" stroke={c} strokeWidth="2.2" strokeOpacity=".8"/>
      <line x1="94" y1="6" x2="80" y2="6" stroke={c} strokeWidth="2.2" strokeOpacity=".8"/>
      <line x1="94" y1="6" x2="94" y2="20" stroke={c} strokeWidth="2.2" strokeOpacity=".8"/>
      <text x="50" y="65" textAnchor="middle" fill={c} fontSize="46" fontFamily="Georgia,serif" fontWeight="400" letterSpacing="6">{L}</text>
    </svg>
  );
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" fill="#141618"/>
      <rect x="0" y="0" width="100" height="7" fill={c} fillOpacity=".9"/>
      <text x="54" y="82" textAnchor="middle" fill={c} fontSize="70" fontFamily="Arial Black,sans-serif" fontWeight="900" letterSpacing="-4">{L}</text>
    </svg>
  );
}

function Landing({ onStart }: any) {
  const [count] = useState(() => Math.floor(Math.random() * 60) + 90);
  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(7,8,9,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <MiniLogo L="B" color={GOLD} style="minimal" size={22} />
          <span style={{ fontFamily: "'Playfair Display',serif", color: "#EDE5D4", fontSize: "15px", fontWeight: "700" }}>BrandMind</span>
        </div>
        <button onClick={goBuy} className="g" style={{ padding: "8px 18px", fontSize: "12px" }}>Get Pro — $49</button>
      </nav>

      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", animation: "fadeUp .7s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: `1px solid ${GOLD}30`, borderRadius: "100px", padding: "6px 16px", marginBottom: "24px", background: `${GOLD}08` }}>
            <span style={{ width: "6px", height: "6px", background: "#4CAF50", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            <span style={{ color: "#aaa", fontSize: "11px" }}>{count} <span style={{ color: GOLD, fontWeight: "700" }}>brands generated today</span></span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(44px,8vw,92px)", fontWeight: "900", color: "#EDE5D4", lineHeight: "1.04", marginBottom: "4px" }}>Your brand.</h1>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(44px,8vw,92px)", fontWeight: "900", color: GOLD, lineHeight: "1.04", marginBottom: "32px", fontStyle: "italic" }}>Your content. Automated.</h1>
          <p style={{ color: "#999", fontSize: "18px", maxWidth: "500px", margin: "0 auto 44px", lineHeight: "1.8" }}>Brand identity + 30 posts + website copy + Reel scripts. All in your voice. All in under 2 minutes.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
            <button onClick={onStart} className="g" style={{ padding: "18px 48px", fontSize: "16px", borderRadius: "10px" }}>✦ Try Free — Generate My Brand</button>
            <button onClick={goBuy} className="o" style={{ padding: "18px 28px", fontSize: "15px" }}>Buy Now — $49</button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "28px", flexWrap: "wrap" }}>
            {["⭐ 4.9/5 from 400+ reviews", "✦ 2,400+ brands built", "🔒 One-time $49"].map((t, i) => (
              <span key={i} style={{ color: "#555", fontSize: "12px" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 20px 80px", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <p style={{ color: GOLD, fontSize: "10px", letterSpacing: ".22em", fontWeight: "700", marginBottom: "10px" }}>TESTIMONIALS</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,4vw,44px)", color: "#EDE5D4" }}>Real brands. Real results.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card" style={{ padding: "24px" }}>
              <div style={{ marginBottom: "12px" }}>{"⭐".repeat(t.stars)}</div>
              <p style={{ color: "#bbb", fontSize: "13px", lineHeight: "1.8", marginBottom: "16px", fontStyle: "italic" }}>"{t.text}"</p>
              <p style={{ color: "#EDE5D4", fontSize: "13px", fontWeight: "600" }}>{t.name}</p>
              <p style={{ color: "#555", fontSize: "11px", marginTop: "2px" }}>{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 20px 100px", maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
        <div className="card-g" style={{ padding: "40px" }}>
          <p style={{ color: GOLD, fontSize: "10px", letterSpacing: ".22em", fontWeight: "700", marginBottom: "10px" }}>GET STARTED</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,4vw,44px)", color: "#EDE5D4", marginBottom: "12px" }}>Ready to build your brand?</h2>
          <p style={{ color: "#888", fontSize: "15px", marginBottom: "28px", lineHeight: "1.8" }}>Free to try. $49 one-time to unlock everything.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onStart} className="g" style={{ padding: "16px 40px", fontSize: "16px" }}>✦ Try Free</button>
            <button onClick={goBuy} className="o" style={{ padding: "16px 24px", fontSize: "15px" }}>Get Pro — $49</button>
          </div>
          <p style={{ color: "#444", fontSize: "12px", marginTop: "16px" }}>🔒 Secure payment via Stripe · 7-day money-back guarantee</p>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,.04)", padding: "20px 24px", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
        <MiniLogo L="B" color={GOLD} style="minimal" size={16} />
        <span style={{ color: "#333", fontSize: "11px", letterSpacing: ".1em" }}>BRANDMIND © 2025</span>
      </footer>
    </div>
  );
}

function Generator({ onBack, onGenerate }: any) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [ind, setInd] = useState("");
  const [vals, setVals] = useState<string[]>([]);
  const [aud, setAud] = useState("");
  const [style, setStyle] = useState("");

  const valid = useCallback(() => {
    if (step === 1) return name.trim().length > 1;
    if (step === 2) return ind !== "";
    if (step === 3) return vals.length >= 1;
    if (step === 4) return aud.trim().length > 3;
    if (step === 5) return style !== "";
    return false;
  }, [step, name, ind, vals, aud, style]);

  const next = () => { if (!valid()) return; if (step < 5) setStep(s => s + 1); else onGenerate({ name, industry: ind, values: vals, audience: aud, style }); };
  const back = () => step > 1 ? setStep(s => s - 1) : onBack();
  const toggle = (v: string) => setVals(p => p.includes(v) ? p.filter(x => x !== v) : p.length < 3 ? [...p, v] : p);
  const ok = valid();
  const pct = ((step - 1) / 4) * 100;

  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(7,8,9,.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={back} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "13px" }}>← {step === 1 ? "Exit" : "Back"}</button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MiniLogo L="B" color={GOLD} style="minimal" size={18} />
            <span style={{ fontFamily: "'Playfair Display',serif", color: "#aaa", fontSize: "13px" }}>BrandMind</span>
          </div>
          <span style={{ color: "#555", fontSize: "12px" }}>{step}/5</span>
        </div>
        <div style={{ height: "2px", background: "rgba(255,255,255,.05)" }}>
          <div style={{ height: "100%", background: `linear-gradient(90deg,${GOLD},${GOLDB})`, width: `${pct + 25}%`, transition: "width .4s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", padding: "10px 20px" }}>
          {STEP_LABELS.map((l, i) => (
            <div key={i} onClick={() => i + 1 <= step && setStep(i + 1)} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i + 1 <= step ? GOLD : "rgba(255,255,255,.1)", cursor: i + 1 <= step ? "pointer" : "default", transition: "all .3s" }} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 20px 100px" }}>
        <p style={{ color: "#555", fontSize: "10px", letterSpacing: ".18em", fontWeight: "700", marginBottom: "14px", textTransform: "uppercase" }}>STEP {step} OF 5 — {STEP_LABELS[step - 1].toUpperCase()}</p>

        {step === 1 && <>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,6vw,42px)", color: "#EDE5D4", marginBottom: "8px" }}>What's your brand called?</h2>
          <p style={{ color: "#888", fontSize: "15px", marginBottom: "24px" }}>The name of your business, project, or personal brand.</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Luminary, Forge, Nova Studio…" autoFocus style={{ padding: "16px 18px", fontSize: "17px", marginBottom: "20px" }} />
          {name.trim().length > 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "8px" }}>
              {["modern", "classic", "luxury", "playful", "minimal"].map(s => (
                <div key={s} style={{ background: "rgba(255,255,255,.03)", borderRadius: "10px", padding: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", border: "1px solid rgba(255,255,255,.06)" }}>
                  <MiniLogo L={name[0].toUpperCase()} color={GOLD} style={s} size={44} />
                  <span style={{ color: "#555", fontSize: "8px", letterSpacing: ".1em", textTransform: "uppercase" }}>{s}</span>
                </div>
              ))}
            </div>
          )}
        </>}

        {step === 2 && <>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,6vw,42px)", color: "#EDE5D4", marginBottom: "8px" }}>What's your industry?</h2>
          <p style={{ color: "#888", fontSize: "15px", marginBottom: "20px" }}>This shapes your palette, voice and content style.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
            {INDUSTRIES.map(i => (
              <button key={i} onClick={() => setInd(i)} style={{ padding: "12px 14px", textAlign: "left", background: ind === i ? `${GOLD}12` : "rgba(255,255,255,.025)", border: `1px solid ${ind === i ? GOLD + "40" : "rgba(255,255,255,.06)"}`, borderRadius: "9px", color: ind === i ? GOLD : "#bbb", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                {ind === i && "✓ "}{i}
              </button>
            ))}
          </div>
        </>}

        {step === 3 && <>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,6vw,42px)", color: "#EDE5D4", marginBottom: "8px" }}>Pick your brand values</h2>
          <p style={{ color: "#888", fontSize: "15px", marginBottom: "20px" }}><span style={{ color: GOLD }}>Up to 3</span> — these become your brand DNA.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {VALUES.map(v => { const s = vals.includes(v), l = vals.length >= 3 && !s; return (
              <button key={v} onClick={() => !l && toggle(v)} style={{ padding: "9px 16px", background: s ? `${GOLD}15` : "rgba(255,255,255,.03)", border: `1px solid ${s ? GOLD + "50" : "rgba(255,255,255,.07)"}`, borderRadius: "100px", color: s ? GOLD : l ? "#333" : "#bbb", fontSize: "13px", cursor: l ? "default" : "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                {s && "✓ "}{v}
              </button>
            );})}
          </div>
          {vals.length > 0 && <p style={{ color: "#555", fontSize: "12px", marginTop: "14px" }}>Selected: {vals.join(", ")}</p>}
        </>}

        {step === 4 && <>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,6vw,42px)", color: "#EDE5D4", marginBottom: "8px" }}>Who's your audience?</h2>
          <p style={{ color: "#888", fontSize: "15px", marginBottom: "20px", lineHeight: "1.6" }}>Be specific — age, goals, mindset, lifestyle.</p>
          <textarea value={aud} onChange={e => setAud(e.target.value)} rows={6} autoFocus placeholder="e.g. Female entrepreneurs aged 28–42 building online businesses…" style={{ padding: "16px 18px", fontSize: "14px", lineHeight: "1.75", resize: "none" }} />
          <p style={{ color: "#555", fontSize: "11px", marginTop: "6px" }}>{aud.length} characters</p>
        </>}

        {step === 5 && <>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,6vw,42px)", color: "#EDE5D4", marginBottom: "8px" }}>Choose your visual style</h2>
          <p style={{ color: "#888", fontSize: "15px", marginBottom: "20px" }}>This sets the tone for your logo and all content.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)} style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: "14px", background: style === s.id ? `${GOLD}10` : "rgba(255,255,255,.025)", border: `1px solid ${style === s.id ? GOLD + "40" : "rgba(255,255,255,.06)"}`, borderRadius: "10px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                <MiniLogo L={name[0]?.toUpperCase() || "B"} color={style === s.id ? GOLD : "#2a2a2a"} style={s.id} size={40} />
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ color: style === s.id ? GOLD : "#ccc", fontSize: "14px", fontWeight: "600" }}>{s.icon} {s.label}</div>
                  <div style={{ color: "#555", fontSize: "11px", marginTop: "2px" }}>{s.desc}</div>
                </div>
                {style === s.id && <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#0a0806", fontWeight: "800" }}>✓</div>}
              </button>
            ))}
          </div>
        </>}

        <div style={{ marginTop: "28px" }}>
          <button onClick={next} className={ok ? "g" : ""} style={{ width: "100%", padding: "16px", fontSize: "15px", borderRadius: "9px", opacity: ok ? 1 : 0.3, cursor: ok ? "pointer" : "not-allowed", background: ok ? undefined : "rgba(255,255,255,.04)", color: ok ? undefined : "#555", border: ok ? undefined : "1px solid rgba(255,255,255,.05)" }}>
            {step < 5 ? "Next Step →" : "✦ Build My Brand + Content Kit"}
          </button>
          {!ok && <p style={{ color: "#444", fontSize: "11px", textAlign: "center", marginTop: "8px" }}>
            {step === 1 ? "Enter your brand name" : step === 2 ? "Pick an industry" : step === 3 ? "Pick at least 1 value" : step === 4 ? "Describe your audience" : "Pick a style"}
          </p>}
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % LOAD_MSGS.length), 2000); return () => clearInterval(t); }, []);
  return (
    <div style={{ background: BG, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "28px" }}>
      <div style={{ position: "relative", width: "80px", height: "80px" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${GOLD}30`, animation: "spin2 3s linear infinite" }} />
        <div style={{ position: "absolute", inset: "10px", borderRadius: "50%", border: `1px solid ${GOLD}20`, animation: "spin2 2s linear infinite reverse" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MiniLogo L="B" color={GOLD} style="minimal" size={30} />
        </div>
      </div>
      <div style={{ textAlign: "center", maxWidth: "260px" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", color: "#EDE5D4", fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>{LOAD_MSGS[i]}</p>
        <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.7" }}>Building your complete brand identity…</p>
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        {LOAD_MSGS.map((_, x) => <div key={x} style={{ width: "5px", height: "5px", borderRadius: "50%", background: x === i ? GOLD : "#1e1e1e", transition: "background .3s" }} />)}
      </div>
    </div>
  );
}

function Results({ kit, form, onRestart, callAI, isPremium, onVerifyPremium }: any) {
  const [copied, setCopied] = useState<string | null>(null);
  const [tagI, setTagI] = useState(0);
  const [activeTab, setActiveTab] = useState("brand");
  const [allContent, setAllContent] = useState<any>({});
  const [genStatus, setGenStatus] = useState("idle");
  const [kitData, setKitData] = useState(kit);
  const [regenLoading, setRegenLoading] = useState<any>({});

  const copy = (text: string, key: string) => {
    try { navigator.clipboard.writeText(text); } catch (_) {}
    setCopied(key); setTimeout(() => setCopied(null), 1600);
  };

  const regenSection = async (section: string) => {
    setRegenLoading((p: any) => ({ ...p, [section]: true }));
    const ctx = `Brand: ${form.name} | Industry: ${form.industry} | Values: ${form.values.join(", ")} | Style: ${form.style}`;
    try {
      if (section === "colors") {
        const r = await callAI(`Generate a NEW 5-color palette for this brand. ${ctx}\nReturn ONLY raw JSON: {"colors":[{"name":"","hex":"","role":""}]}`);
        setKitData((p: any) => ({ ...p, colors: r.colors || p.colors }));
      } else if (section === "tagline") {
        const r = await callAI(`Generate 3 NEW taglines (max 7 words each) for this brand. ${ctx}\nReturn ONLY raw JSON: {"taglines":["","",""]}`);
        setKitData((p: any) => ({ ...p, taglines: r.taglines || p.taglines }));
        setTagI(0);
      } else if (section === "voice") {
        const r = await callAI(`Generate NEW brand voice and story for this brand. ${ctx}\nReturn ONLY raw JSON: {"brandVoice":"","brandStory":""}`);
        setKitData((p: any) => ({ ...p, brandVoice: r.brandVoice || p.brandVoice, brandStory: r.brandStory || p.brandStory }));
      }
    } catch (e) { console.warn("regen failed", e); }
    setRegenLoading((p: any) => ({ ...p, [section]: false }));
  };

  const generateAll = async () => {
    setGenStatus("running");
    const ctx = `Brand: ${form.name} | Industry: ${form.industry} | Values: ${form.values.join(", ")} | Audience: ${form.audience} | Style: ${form.style}`;
    try {
      const [p, c, r, b] = await Promise.all([
        callAI(`Social media expert. 6 Instagram posts for this brand. ${ctx}\nReturn ONLY raw JSON: {"posts":[{"hook":"","caption":"","hashtags":""}]}`),
        callAI(`Conversion copywriter. Website copy. ${ctx}\nReturn ONLY raw JSON: {"hero":{"headline":"","subheadline":"","cta":""},"about":{"headline":"","body":""},"services":{"headline":"","items":[{"name":"","desc":""}]},"social_proof":""}`),
        callAI(`Video scriptwriter. 3 Reel scripts. ${ctx}\nReturn ONLY raw JSON: {"reels":[{"title":"","hook":"","body":"","cta":"","duration":""}]}`),
        callAI(`Social media bios. ${ctx}\nReturn ONLY raw JSON: {"instagram":{"bio":"","link_cta":""},"tiktok":{"bio":""},"linkedin":{"headline":"","summary":""},"twitter":{"bio":""}}`),
      ]);
      const fb = buildFallbackContent(form);
      setAllContent({ posts: p?.posts || fb.posts, copy: c || fb.copy, reels: r?.reels || fb.reels, bio: b || fb.bio });
      setGenStatus("done");
    } catch (e) {
      setAllContent(buildFallbackContent(form));
      setGenStatus("done");
    }
  };

  const ALL_TABS = [
    { id: "brand", icon: "🎨", label: "Brand" },
    { id: "posts", icon: "📱", label: "Posts" },
    { id: "copy", icon: "🌐", label: "Copy" },
    { id: "reels", icon: "🎬", label: "Reels" },
    { id: "bio", icon: "✏️", label: "Bio" },
  ];

  const RegenBtn = ({ section, label }: any) => (
    <button onClick={() => regenSection(section)} style={{ padding: "4px 10px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", color: "#777", fontSize: "10px", cursor: "pointer" }}>
      {regenLoading[section] ? "..." : "↻"} {label}
    </button>
  );

  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(7,8,9,.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.05)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <MiniLogo L={form.name[0].toUpperCase()} color={GOLD} style={form.style} size={30} />
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "15px", color: "#EDE5D4", fontWeight: "700" }}>{form.name}</div>
            <div style={{ color: "#444", fontSize: "10px", textTransform: "uppercase", letterSpacing: ".07em" }}>{form.industry}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
          <button onClick={onRestart} className="o" style={{ padding: "7px 12px", fontSize: "12px" }}>↺ New</button>
          {isPremium
            ? <span style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}40`, borderRadius: "6px", color: GOLD, fontSize: "11px", fontWeight: "700", padding: "7px 12px" }}>✓ PRO</span>
            : <button onClick={goBuy} className="g" style={{ padding: "7px 16px", fontSize: "12px" }}>Get Pro — $49</button>
          }
        </div>
      </div>

      <div style={{ borderBottom: "1px solid rgba(255,255,255,.05)", overflowX: "auto", display: "flex", background: "rgba(7,8,9,.8)" }}>
        {ALL_TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "12px 16px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === t.id ? GOLD : "transparent"}`, color: activeTab === t.id ? GOLD : "#555", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: activeTab === t.id ? "600" : "400", whiteSpace: "nowrap", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "16px" }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "20px 16px" }}>
        {activeTab === "brand" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="card-g" style={{ padding: "28px", display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <MiniLogo L={form.name[0].toUpperCase()} color={GOLD} style={form.style} size={90} />
              <div style={{ flex: 1, minWidth: "180px" }}>
                <p style={{ color: GOLD, fontSize: "10px", letterSpacing: ".2em", fontWeight: "700", marginBottom: "5px" }}>BRAND IDENTITY</p>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(26px,5vw,44px)", color: "#EDE5D4", fontWeight: "900", marginBottom: "6px" }}>{form.name}</h1>
                <p style={{ color: GOLD, fontSize: "15px", fontStyle: "italic", fontFamily: "'Playfair Display',serif", marginBottom: "12px" }}>{kitData.taglines?.[tagI]}</p>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ color: "#444", fontSize: "10px" }}>TAGLINE</span>
                  {kitData.taglines?.map((_: any, x: number) => (
                    <button key={x} onClick={() => setTagI(x)} style={{ padding: "3px 9px", background: tagI === x ? `${GOLD}15` : "rgba(255,255,255,.04)", border: `1px solid ${tagI === x ? GOLD + "40" : "rgba(255,255,255,.07)"}`, borderRadius: "100px", color: tagI === x ? GOLD : "#555", fontSize: "10px", cursor: "pointer" }}>{x + 1}</button>
                  ))}
                  <button onClick={() => copy(kitData.taglines?.[tagI], "tag")} style={{ padding: "3px 9px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "100px", color: copied === "tag" ? "#4CAF50" : "#666", fontSize: "10px", cursor: "pointer" }}>{copied === "tag" ? "✓ Copied" : "Copy"}</button>
                </div>
                <RegenBtn section="tagline" label="New taglines" />
              </div>
            </div>

            <div className="card" style={{ padding: "20px" }}>
              <p style={{ color: GOLD, fontSize: "10px", letterSpacing: ".16em", fontWeight: "700", marginBottom: "14px" }}>LOGO STYLES</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["modern", "classic", "luxury", "playful", "minimal"].map(s => (
                  <div key={s} style={{ background: "rgba(0,0,0,.3)", borderRadius: "10px", padding: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: "1", minWidth: "70px" }}>
                    <MiniLogo L={form.name[0].toUpperCase()} color={GOLD} style={s} size={52} />
                    <span style={{ color: "#555", fontSize: "9px", letterSpacing: ".1em", textTransform: "uppercase" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div>
                  <p style={{ color: GOLD, fontSize: "10px", letterSpacing: ".16em", fontWeight: "700", marginBottom: "3px" }}>COLOR SYSTEM</p>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "17px", color: "#EDE5D4" }}>Your palette</h2>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <RegenBtn section="colors" label="New palette" />
                  <button onClick={() => copy(kitData.colors?.map((c: any) => `--${c.name.toLowerCase()}: ${c.hex};`).join("\n"), "css")} style={{ padding: "4px 10px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", color: copied === "css" ? "#4CAF50" : "#777", fontSize: "10px", cursor: "pointer" }}>
                    {copied === "css" ? "✓" : "Copy CSS"}
                  </button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "8px" }}>
                {kitData.colors?.map((c: any, x: number) => (
                  <div key={x} onClick={() => copy(c.hex, `c${x}`)} style={{ cursor: "pointer", borderRadius: "9px", overflow: "hidden", border: "1px solid rgba(255,255,255,.06)" }}>
                    <div style={{ background: c.hex, height: "72px" }} />
                    <div style={{ background: "rgba(255,255,255,.03)", padding: "7px 9px" }}>
                      <div style={{ color: "#bbb", fontSize: "10px", fontWeight: "600", marginBottom: "1px" }}>{c.name}</div>
                      <div style={{ color: GOLD, fontSize: "9px", fontFamily: "monospace" }}>{c.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="card" style={{ padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <p style={{ color: GOLD, fontSize: "10px", letterSpacing: ".16em", fontWeight: "700" }}>BRAND VOICE</p>
                  <RegenBtn section="voice" label="Regenerate" />
                </div>
                <p style={{ color: "#999", fontSize: "13px", lineHeight: "1.8", fontStyle: "italic" }}>{kitData.brandVoice}</p>
              </div>
              <div className="card" style={{ padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <p style={{ color: GOLD, fontSize: "10px", letterSpacing: ".16em", fontWeight: "700" }}>BRAND STORY</p>
                  <button onClick={() => copy(kitData.brandStory, "bs")} style={{ padding: "3px 9px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "5px", color: copied === "bs" ? "#4CAF50" : "#555", fontSize: "10px", cursor: "pointer" }}>{copied === "bs" ? "✓" : "Copy"}</button>
                </div>
                <p style={{ color: "#999", fontSize: "13px", lineHeight: "1.8" }}>{kitData.brandStory}</p>
              </div>
            </div>

            <div className="card-g" style={{ padding: "24px", textAlign: "center" }}>
              {genStatus === "idle" && !isPremium && (
                <PaywallCard onVerifyPremium={onVerifyPremium} />
              )}
              {genStatus === "idle" && isPremium && <>
                <p style={{ color: GOLD, fontSize: "10px", letterSpacing: ".2em", fontWeight: "700", marginBottom: "8px" }}>CONTENT ENGINE</p>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "20px", color: "#EDE5D4", marginBottom: "7px" }}>Generate all your content</h3>
                <p style={{ color: "#777", fontSize: "13px", marginBottom: "18px" }}>30 posts, website copy, Reel scripts, and bios — in your brand voice.</p>
                <button onClick={generateAll} className="g" style={{ padding: "14px 36px", fontSize: "15px" }}>✦ Generate All Content</button>
              </>}
              {genStatus === "running" && (
                <div style={{ padding: "8px 0" }}>
                  <div style={{ display: "inline-flex", gap: "7px", marginBottom: "12px" }}>
                    {[0, 1, 2, 3, 4].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: GOLD, animation: `pulse 1.4s ${i * .2}s infinite` }} />)}
                  </div>
                  <p style={{ fontFamily: "'Playfair Display',serif", color: "#EDE5D4", fontSize: "17px", marginBottom: "5px" }}>Generating your content…</p>
                  <p style={{ color: "#555", fontSize: "12px" }}>~30–60 seconds</p>
                </div>
              )}
              {genStatus === "done" && <>
                <p style={{ color: "#4CAF50", fontSize: "10px", letterSpacing: ".2em", fontWeight: "700", marginBottom: "8px" }}>✓ CONTENT READY</p>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "18px", color: "#EDE5D4", marginBottom: "14px" }}>Your content kit is ready</h3>
                <div style={{ display: "flex", gap: "7px", justifyContent: "center", flexWrap: "wrap" }}>
                  {ALL_TABS.filter(t => t.id !== "brand").map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className="o" style={{ padding: "8px 14px", fontSize: "12px" }}>{t.icon} {t.label}</button>
                  ))}
                </div>
              </>}
            </div>
          </div>
        )}

        {activeTab !== "brand" && (
          <div>
            {!allContent.posts ? (
              <div className="card" style={{ padding: "40px", textAlign: "center" }}>
                <p style={{ color: GOLD, fontSize: "14px", marginBottom: "8px" }}>Content not generated yet</p>
                <p style={{ color: "#666", fontSize: "13px", marginBottom: "18px" }}>Go to Brand tab and click "Generate All Content"</p>
                <button onClick={() => setActiveTab("brand")} className="g" style={{ padding: "12px 24px", fontSize: "14px" }}>← Go to Brand</button>
              </div>
            ) : (
              <>
                {activeTab === "posts" && <PostsView content={allContent.posts} copy={copy} copied={copied} />}
                {activeTab === "copy" && <CopyView content={allContent.copy} copy={copy} copied={copied} />}
                {activeTab === "reels" && <ReelsView content={allContent.reels} copy={copy} copied={copied} />}
                {activeTab === "bio" && <BioView content={allContent.bio} copy={copy} copied={copied} />}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PostsView({ content, copy, copied }: any) {
  const [page, setPage] = useState(0);
  const PER = 4;
  const total = content?.length || 0;
  const pages = Math.ceil(total / PER);
  const current = (content || []).slice(page * PER, page * PER + PER);
  if (!total) return <div style={{ color: "#666", padding: "20px", textAlign: "center" }}>No posts generated.</div>;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <span style={{ color: "#666", fontSize: "12px" }}>Showing {page * PER + 1}–{Math.min((page + 1) * PER, total)} of {total}</span>
        <button onClick={() => copy((content || []).map((p: any, i: number) => `POST ${i + 1}:\n${p.caption}\n\n${p.hashtags}`).join("\n\n---\n\n"), "all-posts")} style={{ padding: "6px 12px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", color: copied === "all-posts" ? "#4CAF50" : "#888", fontSize: "11px", cursor: "pointer" }}>
          {copied === "all-posts" ? "✓ Copied" : "Copy All"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
        {current.map((p: any, i: number) => (
          <div key={i} className="card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "9px" }}>
              <span style={{ background: `${GOLD}14`, color: GOLD, border: `1px solid ${GOLD}20`, borderRadius: "100px", padding: "2px 8px", fontSize: "10px", fontWeight: "600" }}>Post {page * PER + i + 1}</span>
              <button onClick={() => copy(`${p.caption}\n\n${p.hashtags}`, `p${i}`)} style={{ padding: "3px 9px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "5px", color: copied === `p${i}` ? "#4CAF50" : "#777", fontSize: "10px", cursor: "pointer" }}>
                {copied === `p${i}` ? "✓" : "Copy"}
              </button>
            </div>
            <p style={{ color: GOLD, fontSize: "13px", fontWeight: "600", marginBottom: "7px", lineHeight: "1.5", fontStyle: "italic" }}>"{p.hook}"</p>
            <p style={{ color: "#ccc", fontSize: "12px", lineHeight: "1.7", marginBottom: "7px" }}>{p.caption}</p>
            <p style={{ color: "#555", fontSize: "10px", fontFamily: "monospace", lineHeight: "1.6" }}>{p.hashtags}</p>
          </div>
        ))}
      </div>
      {pages > 1 && (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="o" style={{ padding: "7px 14px", fontSize: "12px", opacity: page === 0 ? .3 : 1 }}>← Prev</button>
          {Array(pages).fill(0).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} style={{ width: "28px", height: "28px", borderRadius: "50%", background: page === i ? GOLD : "rgba(255,255,255,.05)", border: `1px solid ${page === i ? GOLD : "rgba(255,255,255,.08)"}`, color: page === i ? "#0a0806" : "#666", fontSize: "12px", cursor: "pointer", fontWeight: page === i ? "700" : "400" }}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page === pages - 1} className="o" style={{ padding: "7px 14px", fontSize: "12px", opacity: page === pages - 1 ? .3 : 1 }}>Next →</button>
        </div>
      )}
    </div>
  );
}

function CopyView({ content, copy, copied }: any) {
  if (!content?.hero) return <div style={{ color: "#666", padding: "20px", textAlign: "center" }}>No website copy generated.</div>;
  const sections = [
    { label: "Hero Section", data: [{ k: "Headline", v: content.hero?.headline }, { k: "Subheadline", v: content.hero?.subheadline }, { k: "CTA", v: content.hero?.cta }], key: "hero" },
    { label: "About Section", data: [{ k: "Headline", v: content.about?.headline }, { k: "Body", v: content.about?.body }], key: "about" },
    { label: "Services", data: (content.services?.items || []).map((s: any) => ({ k: s.name, v: s.desc })), key: "services" },
    { label: "Social Proof", data: [{ k: "Quote", v: content.social_proof }], key: "proof" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => copy(sections.map(s => `${s.label}:\n${s.data.map((d: any) => `${d.k}: ${d.v}`).join("\n")}`).join("\n\n---\n\n"), "all-copy")} style={{ padding: "6px 12px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", color: copied === "all-copy" ? "#4CAF50" : "#888", fontSize: "11px", cursor: "pointer" }}>
          {copied === "all-copy" ? "✓ Copied" : "Copy All"}
        </button>
      </div>
      {sections.map((section, si) => (
        <div key={si} className="card" style={{ padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p style={{ color: GOLD, fontSize: "10px", letterSpacing: ".16em", fontWeight: "700" }}>{section.label.toUpperCase()}</p>
            <button onClick={() => copy(section.data.map((d: any) => `${d.k}: ${d.v}`).join("\n\n"), `s${si}`)} style={{ padding: "3px 9px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "5px", color: copied === `s${si}` ? "#4CAF50" : "#555", fontSize: "10px", cursor: "pointer" }}>{copied === `s${si}` ? "✓" : "Copy"}</button>
          </div>
          {section.data.map((d: any, di: number) => (
            <div key={di} style={{ marginBottom: "9px", paddingBottom: "9px", borderBottom: di < section.data.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
              <p style={{ color: "#444", fontSize: "9px", fontWeight: "700", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "3px" }}>{d.k}</p>
              <p style={{ color: "#bbb", fontSize: "13px", lineHeight: "1.7" }}>{d.v}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ReelsView({ content, copy, copied }: any) {
  if (!content?.length) return <div style={{ color: "#666", padding: "20px", textAlign: "center" }}>No reel scripts generated.</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => copy((content || []).map((s: any, i: number) => `REEL ${i + 1}: ${s.title}\n\nHOOK: ${s.hook}\n\nBODY: ${s.body}\n\nCTA: ${s.cta}`).join("\n\n===\n\n"), "all-reels")} style={{ padding: "6px 12px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", color: copied === "all-reels" ? "#4CAF50" : "#888", fontSize: "11px", cursor: "pointer" }}>
          {copied === "all-reels" ? "✓ Copied" : "Copy All"}
        </button>
      </div>
      {content.map((s: any, i: number) => (
        <div key={i} className="card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ background: `${GOLD}10`, borderBottom: `1px solid ${GOLD}20`, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ background: `${GOLD}20`, color: GOLD, border: `1px solid ${GOLD}30`, borderRadius: "100px", padding: "2px 9px", fontSize: "10px", fontWeight: "600", marginRight: "8px" }}>Reel {i + 1}</span>
              <span style={{ color: "#555", fontSize: "11px" }}>{s.duration}</span>
            </div>
            <button onClick={() => copy(`HOOK: ${s.hook}\n\nBODY: ${s.body}\n\nCTA: ${s.cta}`, `r${i}`)} style={{ padding: "5px 12px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", borderRadius: "6px", color: copied === `r${i}` ? "#4CAF50" : "#888", fontSize: "11px", cursor: "pointer" }}>
              {copied === `r${i}` ? "✓" : "Copy Script"}
            </button>
          </div>
          <div style={{ padding: "18px" }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "17px", color: "#EDE5D4", marginBottom: "14px" }}>{s.title}</h3>
            {[{ t: "🎬 HOOK", sub: "0–3 sec", text: s.hook, col: GOLD, bg: `${GOLD}08` }, { t: "📹 BODY", sub: "Main", text: s.body, col: "#bbb", bg: "rgba(255,255,255,.02)" }, { t: "✦ CTA", sub: "End", text: s.cta, col: GOLD, bg: `${GOLD}05` }].map((b, bi) => (
              <div key={bi} style={{ background: b.bg, border: "1px solid rgba(255,255,255,.06)", borderRadius: "9px", padding: "12px", marginBottom: "10px" }}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ color: b.col, fontSize: "10px", fontWeight: "700" }}>{b.t}</span>
                  <span style={{ color: "#333", fontSize: "10px" }}>{b.sub}</span>
                </div>
                <p style={{ color: b.col, fontSize: "13px", lineHeight: "1.7" }}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BioView({ content, copy, copied }: any) {
  if (!content?.instagram) return <div style={{ color: "#666", padding: "20px", textAlign: "center" }}>No bios generated.</div>;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
        <button onClick={() => copy([`INSTAGRAM:\n${content?.instagram?.bio}`, `TIKTOK:\n${content?.tiktok?.bio}`, `LINKEDIN:\n${content?.linkedin?.headline}\n${content?.linkedin?.summary}`, `TWITTER:\n${content?.twitter?.bio}`].join("\n\n---\n\n"), "all-bio")} style={{ padding: "6px 12px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", color: copied === "all-bio" ? "#4CAF50" : "#888", fontSize: "11px", cursor: "pointer" }}>
          {copied === "all-bio" ? "✓ Copied" : "Copy All"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {[
          { platform: "Instagram", icon: "📸", data: [{ k: "Bio", v: content.instagram?.bio }, { k: "Link CTA", v: content.instagram?.link_cta }], key: "ig" },
          { platform: "TikTok", icon: "🎵", data: [{ k: "Bio", v: content.tiktok?.bio }], key: "tt" },
          { platform: "LinkedIn", icon: "💼", data: [{ k: "Headline", v: content.linkedin?.headline }, { k: "Summary", v: content.linkedin?.summary }], key: "li" },
          { platform: "Twitter/X", icon: "🌐", data: [{ k: "Bio", v: content.twitter?.bio }], key: "tw" },
        ].map((p, pi) => (
          <div key={pi} className="card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ fontSize: "17px" }}>{p.icon}</span>
                <p style={{ color: GOLD, fontSize: "11px", letterSpacing: ".12em", fontWeight: "700" }}>{p.platform.toUpperCase()}</p>
              </div>
              <button onClick={() => copy(p.data.map((d: any) => d.v || "").join("\n\n"), p.key)} style={{ padding: "3px 9px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "5px", color: copied === p.key ? "#4CAF50" : "#555", fontSize: "10px", cursor: "pointer" }}>
                {copied === p.key ? "✓" : "Copy"}
              </button>
            </div>
            {p.data.map((d: any, di: number) => (
              <div key={di} style={{ marginBottom: "7px" }}>
                <p style={{ color: "#444", fontSize: "9px", fontWeight: "700", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "3px" }}>{d.k}</p>
                <p style={{ color: "#bbb", fontSize: "12px", lineHeight: "1.7", whiteSpace: "pre-line" }}>{d.v}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PaywallCard({ onVerifyPremium }: { onVerifyPremium: (email: string) => Promise<boolean> }) {
  const [email, setEmail] = useState("");
  const [buying, setBuying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleBuy = async () => {
    const e = email.trim();
    if (!e) { setError("Enter your email first"); return; }
    setBuying(true);
    setError("");
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
      else setError("Checkout error. Try again.");
    } catch {
      setError("Checkout error. Try again.");
    }
    setBuying(false);
  };

  const handleVerify = async () => {
    const e = email.trim();
    if (!e) { setError("Enter your email first"); return; }
    setVerifying(true);
    setError("");
    const ok = await onVerifyPremium(e);
    setVerifying(false);
    if (!ok) setError("No purchase found for this email. Contact support if you've already paid.");
  };

  return (
    <>
      <p style={{ color: GOLD, fontSize: "10px", letterSpacing: ".2em", fontWeight: "700", marginBottom: "8px" }}>PRO FEATURE</p>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "20px", color: "#EDE5D4", marginBottom: "7px" }}>Unlock your full content kit</h3>
      <p style={{ color: "#777", fontSize: "13px", marginBottom: "18px", lineHeight: "1.7" }}>30 posts, website copy, Reel scripts & bios — generated in your brand voice.</p>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleBuy()}
        placeholder="your@email.com"
        style={{ padding: "12px 16px", fontSize: "14px", marginBottom: "10px", textAlign: "center", width: "100%", maxWidth: "320px" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
        <button
          onClick={handleBuy}
          disabled={buying}
          className="g"
          style={{ padding: "14px 36px", fontSize: "15px", width: "100%", maxWidth: "320px", opacity: buying ? 0.7 : 1 }}
        >
          {buying ? "Loading…" : "✦ Get Pro — $49"}
        </button>
        <button
          onClick={handleVerify}
          disabled={verifying}
          style={{ background: "none", border: "1px solid rgba(255,255,255,.1)", borderRadius: "8px", color: "#666", fontSize: "13px", padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", width: "100%", maxWidth: "320px" }}
        >
          {verifying ? "Verifying…" : "Already purchased? Activate →"}
        </button>
      </div>
      {error && <p style={{ color: "#ff6b6b", fontSize: "12px", marginTop: "10px" }}>{error}</p>}
      <p style={{ color: "#333", fontSize: "11px", marginTop: "14px" }}>🔒 One-time $49 · 7-day money-back guarantee</p>
    </>
  );
}

function buildFallback(d: any) {
  const P: any = { modern: [{ n: "Cobalt", h: "#004ECC" }, { n: "Slate", h: "#1A3A52" }, { n: "Cyan", h: "#00BFFF" }, { n: "Light", h: "#E8F4FD" }, { n: "Dark", h: "#0A0E14" }], classic: [{ n: "Burgundy", h: "#6B1E2E" }, { n: "Gold", h: "#C4975A" }, { n: "Cream", h: "#F5EDD6" }, { n: "Charcoal", h: "#2C2C2C" }, { n: "Ivory", h: "#F9F6EE" }], playful: [{ n: "Coral", h: "#FF6B6B" }, { n: "Sunshine", h: "#FFD93D" }, { n: "Mint", h: "#6BCB77" }, { n: "Sky", h: "#4D96FF" }, { n: "Cloud", h: "#F0F4FF" }], luxury: [{ n: "Obsidian", h: "#0A0705" }, { n: "Champagne", h: "#C4975A" }, { n: "Taupe", h: "#8B7355" }, { n: "Ivory", h: "#F8F2E8" }, { n: "Noir", h: "#040208" }], minimal: [{ n: "Ink", h: "#111111" }, { n: "Steel", h: "#4A5568" }, { n: "Silver", h: "#A0AEC0" }, { n: "Mist", h: "#F7F8FA" }, { n: "Accent", h: "#2D3748" }] };
  const F: any = { modern: { d: "Syne", b: "DM Sans" }, classic: { d: "Playfair Display", b: "Lora" }, playful: { d: "Nunito", b: "Quicksand" }, luxury: { d: "Cormorant Garamond", b: "DM Sans" }, minimal: { d: "Space Grotesk", b: "Inter" } };
  const pal = P[d.style] || P.modern, fnt = F[d.style] || F.modern;
  return { taglines: [`${d.name} — ${d.industry.toLowerCase()} refined`, `Built on ${d.values[0] || "trust"}`, `Where ${d.values[0] || "quality"} meets results`], colors: pal.map((c: any, i: number) => ({ name: c.n, hex: c.h, role: ["Primary", "Secondary", "Accent", "Light", "Dark"][i] })), typography: { display: { name: fnt.d, description: "Headlines" }, body: { name: fnt.b, description: "Body text" } }, brandVoice: `${d.name} speaks with ${d.values[0] || "confidence"} and clarity.`, brandStory: `${d.name} was built for ${d.audience.slice(0, 60)}.` };
}

function buildFallbackContent(form: any) {
  const n = form.name, ind = form.industry, v = form.values[0] || "quality";
  return {
    posts: [
      { hook: `Here's why ${n} stands out in ${ind}...`, caption: `At ${n}, we believe ${v} isn't a feature — it's a foundation.`, hashtags: `#${ind.replace(/ /g, "")} #${v} #business #branding` },
      { hook: `We started ${n} because we saw a gap in ${ind}.`, caption: `The gap wasn't talent. It was ${v}. We built ${n} to fix that.`, hashtags: `#founderstory #startup #${ind.replace(/ /g, "")}` },
      { hook: `3 things every ${ind} brand needs:`, caption: `1. Clarity\n2. Consistency\n3. ${v}\n\nWe built ${n} on these.`, hashtags: `#tips #${ind.replace(/ /g, "")} #business` },
      { hook: `Your brand is your most powerful asset.`, caption: `It works when you sleep. At ${n}, we help you build that.`, hashtags: `#branding #${v} #business` },
      { hook: `What's your biggest challenge in ${ind}?`, caption: `We ask because we've solved most of them. Drop your answer below.`, hashtags: `#community #${ind.replace(/ /g, "")} #founder` },
      { hook: `Ready to level up your ${ind} presence?`, caption: `${n} has helped brands go from invisible to unforgettable.`, hashtags: `#growth #${ind.replace(/ /g, "")} #results` },
    ],
    copy: { hero: { headline: `${n} — ${v} meets results`, subheadline: `Built for ${form.audience.slice(0, 60)}`, cta: "Start your journey →" }, about: { headline: `Built on ${v}`, body: `${n} exists because ${ind} professionals deserve better.` }, services: { headline: "What we do", items: [{ name: "Brand Identity", desc: "Logo, colors, typography" }, { name: "Content Strategy", desc: "Posts and copy that converts" }] }, social_proof: `"${n} transformed how we show up. Results in 30 days."` },
    reels: [
      { title: `The ${ind} truth nobody tells you`, hook: `I wish someone told me this sooner...`, body: `${v} isn't optional in ${ind} — it's everything.`, cta: `Follow for more ${ind} tips`, duration: "45–60 sec" },
      { title: `Why I built ${n}`, hook: `This is a story I've never told publicly.`, body: `I built ${n} because ${ind} needed a better solution.`, cta: "Comment 'BRAND' for our guide", duration: "60–90 sec" },
      { title: `One shift that changes everything`, hook: `Stop doing this in ${ind}...`, body: `Focus on transformation, not features. That's what ${n} does.`, cta: "Save this", duration: "30–45 sec" },
    ],
    bio: { instagram: { bio: `${v} in ${ind} ✦\n↓ Free brand kit`, link_cta: "Free brand kit →" }, tiktok: { bio: `${n} ✦ ${ind} | ${v} Tips` }, linkedin: { headline: `Founder at ${n} | ${ind}`, summary: `Helping ${form.audience.slice(0, 60)} through ${v}.` }, twitter: { bio: `${n} | ${ind} | ${v} over everything` } },
  };
}