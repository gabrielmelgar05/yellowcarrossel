export type SplitResult = { heading: string; subheading: string; body: string };

function normalizeText(input: string): string {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitNumbered(text: string): string[] {
  // Detecta blocos tipo:
  // 1) ...
  // 2. ...
  // 3 - ...
  const rx = /(?:^|\n)\s*(\d{1,2})\s*[\)\.\-:]\s+/g;
  const matches = Array.from(text.matchAll(rx));
  if (matches.length < 2) return [];

  const chunks: string[] = [];
  for (let i = 0; i < matches.length; i++) {
    const start = (matches[i].index ?? 0) + (matches[i][0]?.length ?? 0);
    const end = i + 1 < matches.length ? (matches[i + 1].index ?? text.length) : text.length;

    const chunk = text.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
  }
  return chunks;
}

function splitParagraphs(text: string): string[] {
  const parts = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length >= 2 ? parts : [];
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function makeHeading(i: number, chunk: string): SplitResult {
  const cleaned = chunk.trim();
  const lines = cleaned
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length >= 2 && lines[0].length <= 72) {
    return { heading: lines[0], subheading: "", body: lines.slice(1).join("\n").trim() };
  }

  return { heading: `Parte ${i}`, subheading: "", body: cleaned };
}

export function splitIntoSlides(raw: string, desiredCount: number): SplitResult[] {
  const slideCount = clamp(desiredCount, 3, 9);
  const text = normalizeText(raw);

  if (!text) {
    return Array.from({ length: slideCount }, (_, idx) => ({
      heading: `Parte ${idx + 1}`,
      subheading: "",
      body: "",
    }));
  }

  const numbered = splitNumbered(text);
  const paragraphs = splitParagraphs(text);
  const base = numbered.length ? numbered : paragraphs.length ? paragraphs : splitSentences(text);
  const units = base.length ? base : [text];

  // balanceamento simples por tamanho
  const totalChars = units.reduce((a, b) => a + b.length, 0);
  const targetPerSlide = Math.max(220, Math.floor(totalChars / slideCount));

  const buckets: string[] = [];
  let current = "";

  for (const u of units) {
    const candidate = current ? `${current}\n${u}` : u;
    if (candidate.length <= targetPerSlide || current.length < 90) {
      current = candidate;
    } else {
      buckets.push(current.trim());
      current = u;
    }
  }
  if (current.trim()) buckets.push(current.trim());

  while (buckets.length < slideCount) buckets.push("");
  while (buckets.length > slideCount) {
    const last = buckets.pop() ?? "";
    buckets[buckets.length - 1] = `${buckets[buckets.length - 1]}\n${last}`.trim();
  }

  return buckets.map((chunk, idx) => makeHeading(idx + 1, chunk));
}
