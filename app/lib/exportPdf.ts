type Color = [number, number, number];

function hexToRgb(hex: string): Color {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export async function downloadBrandKitPDF(kitData: any, form: any, allContent: any) {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

  const W = 210;
  const M = 18;
  const CW = W - M * 2;
  let y = 0;

  const GOLD: Color = [196, 151, 90];
  const DARK: Color = [22, 22, 24];
  const MID: Color = [100, 100, 100];
  const BODY: Color = [60, 60, 60];

  const newPage = () => {
    doc.addPage();
    y = 0;
    doc.setFillColor(...GOLD);
    doc.rect(0, 0, W, 1.5, "F");
    y = M + 4;
  };

  const guard = (needed: number) => {
    if (y + needed > 282) newPage();
  };

  // ── Header bar ──────────────────────────────────────────────────────────
  doc.setFillColor(...GOLD);
  doc.rect(0, 0, W, 1.5, "F");

  // Light background for the whole page
  doc.setFillColor(252, 251, 249);
  doc.rect(0, 1.5, W, 295.5, "F");

  y = M + 10;

  // Brand name
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(form.name, M, y);
  y += 7;

  // Industry + Style
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MID);
  doc.text(`${form.industry.toUpperCase()}  ·  ${(form.style || "").toUpperCase()}`, M, y);
  y += 6;

  // Divider
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.line(M, y, M + CW, y);
  y += 8;

  // Tagline
  if (kitData.taglines?.[0]) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...GOLD);
    const lines = doc.splitTextToSize(`"${kitData.taglines[0]}"`, CW);
    lines.forEach((l: string) => { doc.text(l, M, y); y += 6; });
    y += 4;
  }

  // ── Color Palette ────────────────────────────────────────────────────────
  guard(42);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GOLD);
  doc.text("COLOR PALETTE", M, y);
  y += 5;

  const colors: any[] = kitData.colors || [];
  const swW = CW / Math.max(colors.length, 1) - 2;
  const swH = 16;
  colors.forEach((c: any, i: number) => {
    const x = M + i * (swW + 2);
    const rgb = hexToRgb(c.hex || "#888888");
    doc.setFillColor(...rgb);
    doc.roundedRect(x, y, swW, swH, 2, 2, "F");
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text(c.name || "", x, y + swH + 3.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MID);
    doc.text(c.hex || "", x, y + swH + 7);
  });
  y += swH + 12;

  // ── Typography ───────────────────────────────────────────────────────────
  if (kitData.typography) {
    guard(22);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GOLD);
    doc.text("TYPOGRAPHY", M, y);
    y += 5;

    const typoRows = [
      { label: "Display / Headlines", name: kitData.typography.display?.name },
      { label: "Body Text", name: kitData.typography.body?.name },
    ];
    typoRows.forEach(({ label, name }) => {
      if (!name) return;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      doc.text(name, M, y);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MID);
      doc.text(label, M + 70, y);
      y += 6;
    });
    y += 4;
  }

  // ── Taglines ────────────────────────────────────────────────────────────
  if (kitData.taglines?.length > 1) {
    guard(28);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GOLD);
    doc.text("TAGLINE OPTIONS", M, y);
    y += 5;

    kitData.taglines.forEach((t: string, i: number) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", i === 0 ? "bolditalic" : "italic");
      doc.setTextColor(i === 0 ? GOLD[0] : DARK[0], i === 0 ? GOLD[1] : DARK[1], i === 0 ? GOLD[2] : DARK[2]);
      doc.text(`${i + 1}.  ${t}`, M, y);
      y += 6;
    });
    y += 4;
  }

  // ── Brand Voice ──────────────────────────────────────────────────────────
  if (kitData.brandVoice) {
    guard(30);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GOLD);
    doc.text("BRAND VOICE", M, y);
    y += 5;

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...BODY);
    const lines = doc.splitTextToSize(kitData.brandVoice, CW);
    lines.forEach((l: string) => { guard(6); doc.text(l, M, y); y += 5; });
    y += 5;
  }

  // ── Brand Story ──────────────────────────────────────────────────────────
  if (kitData.brandStory) {
    guard(30);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GOLD);
    doc.text("BRAND STORY", M, y);
    y += 5;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BODY);
    const lines = doc.splitTextToSize(kitData.brandStory, CW);
    lines.forEach((l: string) => { guard(6); doc.text(l, M, y); y += 5; });
    y += 5;
  }

  // Footer page 1
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text("Generated by BrandMind", M, 291);
  doc.text(`brandmind.app  ·  ${new Date().toLocaleDateString()}`, W - M, 291, { align: "right" });

  // ── Page 2: Social Content (premium) ────────────────────────────────────
  if (allContent?.posts?.length) {
    newPage();

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text("Social Media Content", M, y);
    y += 12;

    allContent.posts.forEach((post: any, i: number) => {
      guard(44);

      // Post header
      doc.setFillColor(249, 246, 240);
      const boxStart = y - 4;

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...GOLD);
      doc.text(`POST ${i + 1}`, M, y);
      y += 5;

      // Hook
      doc.setFontSize(10);
      doc.setFont("helvetica", "bolditalic");
      doc.setTextColor(...DARK);
      const hookLines = doc.splitTextToSize(`"${post.hook}"`, CW);
      hookLines.forEach((l: string) => { guard(5); doc.text(l, M, y); y += 5; });
      y += 2;

      // Caption
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...BODY);
      const capLines = doc.splitTextToSize(post.caption, CW).slice(0, 5);
      capLines.forEach((l: string) => { guard(4.5); doc.text(l, M, y); y += 4.5; });
      y += 2;

      // Hashtags
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 160);
      const tags = (post.hashtags || "").slice(0, 80);
      doc.text(tags, M, y);
      y += 10;

      // Divider
      if (i < allContent.posts.length - 1) {
        doc.setDrawColor(220, 215, 205);
        doc.setLineWidth(0.2);
        doc.line(M, y - 4, M + CW, y - 4);
      }
    });

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 180);
    doc.text("Generated by BrandMind", M, 291);
    doc.text(`brandmind.app  ·  ${new Date().toLocaleDateString()}`, W - M, 291, { align: "right" });
  }

  const filename = `${form.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-brand-kit.pdf`;
  doc.save(filename);
}
