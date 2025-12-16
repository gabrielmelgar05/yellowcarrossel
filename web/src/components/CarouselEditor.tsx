import { useMemo, useState } from "react";
import type { CarouselTheme, SlideContent } from "../lib/types";
import { splitIntoSlides } from "../lib/splitIntoSlides";
import { exportSlidesToZip } from "../lib/exportSlides";
import SlideCanvas from "./SlideCanvas";

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

const DEFAULT_THEME: CarouselTheme = {
  profileHandle: "@nomedoperfil",
  bgColor: "#000000",
  textColor: "#ffffff",
  accentColor: "#d2b24c",
};

export default function CarouselEditor() {
  const [rawText, setRawText] = useState<string>("");
  const [count, setCount] = useState<number>(9);

  const [theme, setTheme] = useState<CarouselTheme>(DEFAULT_THEME);
  const [slides, setSlides] = useState<SlideContent[]>(() => splitIntoSlides("", 9));

  const slideIds = useMemo(() => slides.map((s) => `slide-${s.index}`), [slides]);

  function generate(): void {
    const next = splitIntoSlides(rawText, count);
    // Mantém imagens que o usuário já colocou (se regenerar)
    const merged = next.map((s) => {
      const existing = slides.find((x) => x.index === s.index);
      return { ...s, imageDataUrl: existing?.imageDataUrl ?? null };
    });
    setSlides(merged);
  }

  async function setImageForSlide(index: number, file: File): Promise<void> {
    const url = await readFileAsDataURL(file);
    setSlides((prev) =>
      prev.map((s) => (s.index === index ? { ...s, imageDataUrl: url } : s))
    );
  }

  return (
    <div className="grid lg:grid-cols-[420px_1fr] gap-6">
      {/* Painel */}
      <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
        <h2 className="font-semibold text-lg">CARROSSEL (3 a 9)</h2>
        <p className="text-sm text-neutral-400 mt-1">
          Cole o texto do conteúdo (pode vir em 9 partes numeradas ou não). Clique em gerar e ajuste imagens por slide.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="carousel-text" className="text-sm text-neutral-300">
              Texto do carrossel
            </label>
            <textarea
              id="carousel-text"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="mt-2 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm min-h-[160px]"
              placeholder={`Exemplo:\n1) O primeiro bug...\n2) O que aconteceu...\n...`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="carousel-count" className="text-sm text-neutral-300">
                Quantidade de slides
              </label>
              <input
                id="carousel-count"
                type="number"
                min={3}
                max={9}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="mt-2 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm"
              />
              <p className="text-xs text-neutral-500 mt-1">Padrão recomendado: 9</p>
            </div>

            <div className="flex items-end">
              <button
                onClick={generate}
                className="w-full rounded-xl bg-white text-black px-4 py-3 font-semibold"
              >
                Gerar carrossel
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800">
            <h3 className="font-semibold">Tema visual (carrossel)</h3>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label htmlFor="theme-handle" className="text-sm text-neutral-300">
                  @ do perfil
                </label>
                <input
                  id="theme-handle"
                  value={theme.profileHandle}
                  onChange={(e) => setTheme({ ...theme, profileHandle: e.target.value })}
                  className="mt-2 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label htmlFor="theme-bg" className="text-sm text-neutral-300">
                  Cor do fundo (preto)
                </label>
                <input
                  id="theme-bg"
                  type="color"
                  value={theme.bgColor}
                  onChange={(e) => setTheme({ ...theme, bgColor: e.target.value })}
                  className="mt-2 w-full h-10 rounded-lg bg-neutral-950 border border-neutral-800"
                />
              </div>

              <div>
                <label htmlFor="theme-text" className="text-sm text-neutral-300">
                  Cor do texto
                </label>
                <input
                  id="theme-text"
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                  className="mt-2 w-full h-10 rounded-lg bg-neutral-950 border border-neutral-800"
                />
              </div>

              <div>
                <label htmlFor="theme-accent" className="text-sm text-neutral-300">
                  Cor de destaque (amarelo)
                </label>
                <input
                  id="theme-accent"
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                  className="mt-2 w-full h-10 rounded-lg bg-neutral-950 border border-neutral-800"
                />
              </div>
            </div>

            <button
              onClick={() => exportSlidesToZip(slideIds)}
              className="mt-4 w-full rounded-xl bg-neutral-100 text-black px-4 py-3 font-semibold disabled:opacity-50"
              disabled={slides.length === 0}
            >
              Exportar PNGs (1080×1350) em ZIP
            </button>
          </div>

          <div className="pt-3 border-t border-neutral-800">
            <h3 className="font-semibold">Imagens por slide</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Faça upload da imagem do slide (opcional). Se não enviar, fica o “frame” padrão.
            </p>

            <div className="mt-3 space-y-3">
              {slides.map((s) => (
                <div key={s.index} className="flex items-center justify-between gap-3">
                  <div className="text-sm text-neutral-200">Slide {s.index}</div>

                  <label className="text-xs text-neutral-300">
                    <span className="sr-only">Selecionar imagem do slide {s.index}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="text-xs"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        await setImageForSlide(s.index, f);
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-6">
        {/* Preview em escala (não altera o tamanho real 1080x1350) */}
        <div className="grid gap-6">
          {slides.map((s) => (
            <div key={s.index} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-neutral-200">Slide {s.index}</div>
                <div className="text-xs text-neutral-500">Preview (escala)</div>
              </div>

              <div className="overflow-auto">
                <div style={{ transform: "scale(0.28)", transformOrigin: "top left", width: 1080, height: 1350 }}>
                  <SlideCanvas
                    id={`slide-${s.index}`}
                    theme={theme}
                    slide={s}
                    variant={s.index % 2 === 0 ? "black" : "yellow"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
