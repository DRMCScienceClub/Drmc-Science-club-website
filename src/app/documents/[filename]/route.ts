const prototypeDocuments = {
  "quantum-horizon-2026-brochure.pdf": "Quantum Horizon 2026 - Festival Brochure",
  "quantum-horizon-2026-rulebook.pdf": "Quantum Horizon 2026 - Segment Rulebook",
  "innovation-frontier-2025-brochure.pdf": "Innovation Frontier 2025 - Festival Brochure",
  "innovation-frontier-2025-rulebook.pdf": "Innovation Frontier 2025 - Segment Rulebook",
  "cosmic-inquiry-2024-brochure.pdf": "Cosmic Inquiry 2024 - Festival Brochure",
  "cosmic-inquiry-2024-rulebook.pdf": "Cosmic Inquiry 2024 - Segment Rulebook",
  "anuron-2026.pdf": "Anuron 2026 - Signals of Tomorrow",
  "anuron-2025.pdf": "Anuron 2025 - Living Systems",
  "anuron-2024.pdf": "Anuron 2024 - The Measure of Wonder",
} as const;

export const dynamic = "force-static";

export function generateStaticParams() {
  return Object.keys(prototypeDocuments).map((filename) => ({ filename }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const title = prototypeDocuments[filename as keyof typeof prototypeDocuments];

  if (!title) {
    return new Response("Prototype document not found", { status: 404 });
  }

  const pdf = createPrototypePdf(title);
  return new Response(pdf, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "application/pdf",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function createPrototypePdf(title: string) {
  const encoder = new TextEncoder();
  const body = [
    "BT",
    "/F1 20 Tf",
    "72 700 Td",
    "(DRMC Science Club) Tj",
    "0 -36 Td",
    "/F1 13 Tf",
    `(${escapePdfText(title)}) Tj`,
    "0 -28 Td",
    "/F1 10 Tf",
    "(Phase 1 prototype document - no official content.) Tj",
    "ET",
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${encoder.encode(body).length} >>\nstream\n${body}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let output = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((object, index) => {
    offsets.push(encoder.encode(output).length);
    output += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = encoder.encode(output).length;
  output += `xref\n0 ${objects.length + 1}\n`;
  output += "0000000000 65535 f \n";
  offsets.forEach((offset) => {
    output += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return encoder.encode(output);
}

function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}
