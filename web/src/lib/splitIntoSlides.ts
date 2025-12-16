import type { SlideContent, SlideLayout } from "./types";

function normalizeText(input: string): string {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Detecta blocos numerados:
 * 1) ...
 * 2. ...
 * 3 - ...
 * 4: ...
 */
function splitNumbered(text: string): string[] {
  const rx = /(?:^|\n)\s*(\d{1,2})\s*[)\.\-:]\s+/g;
  const matches = Array.from(text.matchAll(rx));
  if (matches.length < 3) return [];

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

function pickLayout(index: number): SlideLayout {
  // alterna layouts para ficar "vivo" (padrão dos exemplos)
  const cycle: SlideLayout[] = ["imageLeft", "imageRight", "imageBottom", "imageTop"];
  return cycle[(index - 1) % cycle.length];
}

function toBullets(chunk: string): string[] {
  const lines = chunk
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Se já vier com bullets, respeita
  const bulletLike = lines.filter((l) => /^[-•]\s+/.test(l)).map((l) => l.replace(/^[-•]\s+/, ""));
  if (bulletLike.length >= 2) return bulletLike.slice(0, 6);

  // Senão, transforma em “linhas” (limitando)
  if (lines.length >= 3) return lines.slice(0, 6);

  // Senão, quebra por frase e limita
  const sentences = chunk.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  return sentences.slice(0, 6);
}

function makeTitle(chunk: string, idx: number): { title: string; subtitle: string; rest: string } {
  const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);

  // Se a 1ª linha for curta, usa como título
  if (lines.length >= 2 && lines[0].length <= 60) {
    const title = lines[0];
    const rest = lines.slice(1).join("\n").trim();
    return { title, subtitle: "", rest };
  }

  return { title: `Parte ${idx}`, subtitle: "", rest: chunk.trim() };
}

export function splitIntoSlides(raw: string, desiredCount: number): SlideContent[] {
  const slideCount = clamp(desiredCount, 3, 9);
  const text = normalizeText(raw);

  if (!text) {
    return Array.from({ length: slideCount }, (_, i) => ({
      index: i + 1,
      title: `Parte ${i + 1}`,
      subtitle: "",
      bullets: [],
      layout: pickLayout(i + 1),
      imageDataUrl: null,
    }));
  }

  const numbered = splitNumbered(text);
  const base = numbered.length ? numbered : (splitParagraphs(text).length ? splitParagraphs(text) : splitSentences(text));
  const units = base.length ? base : [text];

  // Balanceamento simples por tamanho
  const totalChars = units.reduce((a, b) => a + b.length, 0);
  const targetPerSlide = Math.max(240, Math.floor(totalChars / slideCount));

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

  return buckets.map((chunk, idx) => {
    const { title, subtitle, rest } = makeTitle(chunk, idx + 1);
    return {
      index: idx + 1,
      title,
      subtitle,
      bullets: rest ? toBullets(rest) : [],
      layout: pickLayout(idx + 1),
      imageDataUrl: null,
    };
  });
}
