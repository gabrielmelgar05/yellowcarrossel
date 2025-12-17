import { useMemo, useState } from "react";
import type { CarouselSlide, CarouselTheme, SlideLayout } from "../lib/types";
import { splitIntoSlides } from "../lib/splitIntoSlides";
import SlideCanvas from "./SlideCanvas";

const DEFAULT_THEME: CarouselTheme = {
  profileHandle: "@nomedoperfil",
  bgColor: "#0A0A0A",
  textColor: "#F3F3F3",
  accentColor: "#D3B04A", // amarelo
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function makeDefaultSlide(index: number, heading: string, body: string): CarouselSlide {
  return {
    index,
    layout: index % 2 === 0 ? "textTopImageBottom" : "imageTopTextBottom",

    showTitle: true,
    showSubtitle: false,
    bodyBold: false,

    title: heading || `Parte ${index}`,
    subtitle: "",
    body: body || "",

    titleSize: 98,
    subtitleSize: 52,
    bodySize: 40,

    imageDataUrl: null,
    frameHeight: 620,
    imagePosX: 50,
    imagePosY: 50,
  };
}

export default function CarouselEditor() {
  const [rawText, setRawText] = useState("");
  const [slideCount, setSlideCount] = useState<number>(9);

  const [theme, setTheme] = useState<CarouselTheme>(DEFAULT_THEME);

  const [slides, setSlides] = useState<CarouselSlide[]>(() => {
    return Array.from({ length: 3 }, (_, i) => makeDefaultSlide(i + 1, `Parte ${i + 1}`, ""));
  });

  const [current, setCurrent] = useState(0);

  const currentSlide = slides[current];

  const canRender = useMemo(() => slides.length >= 3, [slides.length]);

  function updateSlide(patch: Partial<CarouselSlide>) {
    setSlides((prev) => {
      const copy = [...prev];
      copy[current] = { ...copy[current], ...patch };
      return copy;
    });
  }

  function onGenerate() {
    const count = clamp(Number(slideCount || 9), 3, 9);
    const parts = splitIntoSlides(rawText, count);

    const next: CarouselSlide[] = parts.map((p, i) =>
      makeDefaultSlide(i + 1, p.heading, p.body)
    );

    setSlides(next);
    setCurrent(0);
  }

  function onUploadImage(file: File | null) {
    if (!file) {
      updateSlide({ imageDataUrl: null });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateSlide({ imageDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }

  const layoutOptions: Array<{ key: SlideLayout; label: string }> = [
    { key: "imageTopTextBottom", label: "1) Imagem em cima" },
    { key: "textTopImageBottom", label: "2) Texto em cima" },
  ];

  return (
    <div className="grid lg:grid-cols-[420px_1fr] gap-8">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
        <h2 className="text-lg font-extrabold">CARROSSEL (3 a 9)</h2>
        <p className="text-sm text-neutral-400 mt-1">
          Cole o texto (pode vir numerado ou não). Depois edite slide por slide.
        </p>

        <div className="mt-4 space-y-3">
          <label className="block text-sm font-semibold">Texto do carrossel</label>
          <textarea
            className="w-full min-h-[140px] rounded-lg bg-black border border-neutral-800 p-3 text-sm"
            placeholder={`Exemplo:\n1) O primeiro "bug"...\n2) ...\n3) ...`}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold">Quantidade de slides</label>
              <input
                className="w-full rounded-lg bg-black border border-neutral-800 p-2 text-sm"
                type="number"
                min={3}
                max={9}
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
              />
              <div className="text-xs text-neutral-500 mt-1">Padrão recomendado: 9</div>
            </div>

            <button
              type="button"
              onClick={onGenerate}
              className="px-4 py-2 rounded-lg bg-white text-black font-bold"
            >
              Gerar carrossel
            </button>
          </div>
        </div>

        <hr className="my-5 border-neutral-800" />

        <h3 className="font-extrabold">Tema visual (carrossel)</h3>

        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-sm font-semibold">@ do perfil</label>
            <input
              className="w-full rounded-lg bg-black border border-neutral-800 p-2 text-sm"
              value={theme.profileHandle}
              onChange={(e) => setTheme({ ...theme, profileHandle: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 items-end">
            <div>
              <label className="block text-xs font-semibold">Fundo</label>
              <input
                className="w-full h-10 rounded-lg bg-black border border-neutral-800"
                type="color"
                value={theme.bgColor}
                onChange={(e) => setTheme({ ...theme, bgColor: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold">Texto</label>
              <input
                className="w-full h-10 rounded-lg bg-black border border-neutral-800"
                type="color"
                value={theme.textColor}
                onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold">Destaque</label>
              <input
                className="w-full h-10 rounded-lg bg-black border border-neutral-800"
                type="color"
                value={theme.accentColor}
                onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
              />
            </div>
          </div>
        </div>

        <hr className="my-5 border-neutral-800" />

        <h3 className="font-extrabold">Edição (slide por slide)</h3>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-neutral-300">
            Slide <span className="font-bold">{current + 1}</span> /{" "}
            <span className="font-bold">{slides.length}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              className="px-3 py-2 rounded-lg border border-neutral-800 bg-black"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.min(slides.length - 1, c + 1))}
              className="px-3 py-2 rounded-lg border border-neutral-800 bg-black"
            >
              →
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold">Formato do slide</label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {layoutOptions.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => updateSlide({ layout: o.key })}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    currentSlide.layout === o.key
                      ? "bg-white text-black border-white"
                      : "bg-black text-white border-neutral-800"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold">Imagem do slide (moldura)</label>
            <input
              className="mt-2 block w-full text-sm"
              type="file"
              accept="image/*"
              onChange={(e) => onUploadImage(e.target.files?.[0] ?? null)}
            />
            <div className="text-xs text-neutral-500 mt-1">
              Dica: se não enviar, fica a moldura padrão.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={currentSlide.showTitle}
                onChange={(e) => updateSlide({ showTitle: e.target.checked })}
              />
              Mostrar título
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={currentSlide.showSubtitle}
                onChange={(e) => updateSlide({ showSubtitle: e.target.checked })}
              />
              Mostrar subtítulo
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={currentSlide.bodyBold}
              onChange={(e) => updateSlide({ bodyBold: e.target.checked })}
            />
            Corpo em <b>bold</b>
          </label>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold">Título</label>
              <input
                className="w-full rounded-lg bg-black border border-neutral-800 p-2 text-sm"
                value={currentSlide.title}
                onChange={(e) => updateSlide({ title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">Subtítulo</label>
              <input
                className="w-full rounded-lg bg-black border border-neutral-800 p-2 text-sm"
                value={currentSlide.subtitle}
                onChange={(e) => updateSlide({ subtitle: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">Corpo do texto</label>
              <textarea
                className="w-full min-h-[120px] rounded-lg bg-black border border-neutral-800 p-3 text-sm"
                value={currentSlide.body}
                onChange={(e) => updateSlide({ body: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold">
                Altura da moldura (imagem): <span className="text-neutral-300">{currentSlide.frameHeight}px</span>
              </label>
              <input
                className="w-full"
                type="range"
                min={420}
                max={820}
                value={currentSlide.frameHeight}
                onChange={(e) => updateSlide({ frameHeight: Number(e.target.value) })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold">
                  Posição X: <span className="text-neutral-300">{currentSlide.imagePosX}%</span>
                </label>
                <input
                  className="w-full"
                  type="range"
                  min={0}
                  max={100}
                  value={currentSlide.imagePosX}
                  onChange={(e) => updateSlide({ imagePosX: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Posição Y: <span className="text-neutral-300">{currentSlide.imagePosY}%</span>
                </label>
                <input
                  className="w-full"
                  type="range"
                  min={0}
                  max={100}
                  value={currentSlide.imagePosY}
                  onChange={(e) => updateSlide({ imagePosY: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold">Tamanho do título</label>
              <input
                className="w-full"
                type="range"
                min={56}
                max={132}
                value={currentSlide.titleSize}
                onChange={(e) => updateSlide({ titleSize: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Tamanho do subtítulo</label>
              <input
                className="w-full"
                type="range"
                min={28}
                max={80}
                value={currentSlide.subtitleSize}
                onChange={(e) => updateSlide({ subtitleSize: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Tamanho do corpo</label>
              <input
                className="w-full"
                type="range"
                min={26}
                max={56}
                value={currentSlide.bodySize}
                onChange={(e) => updateSlide({ bodySize: Number(e.target.value) })}
              />
            </div>
          </div>

          <button
            type="button"
            disabled
            className="w-full px-4 py-2 rounded-lg border border-neutral-800 bg-black text-neutral-500 cursor-not-allowed"
            title="Exportação entra depois"
          >
            Exportar PNGs (em breve)
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <h3 className="text-lg font-extrabold">Preview (escala)</h3>
        <p className="text-sm text-neutral-400 mt-1">
          1080×1350 (render real) — aqui está escalado
        </p>

        <div className="mt-4 flex justify-center">
          {canRender ? (
            <div className="origin-top-left scale-[0.35]">
              <SlideCanvas theme={theme} slide={currentSlide} />
            </div>
          ) : (
            <div className="text-neutral-400">Gere o carrossel para ver aqui.</div>
          )}
        </div>

        <div className="mt-8">
          <h4 className="text-sm font-bold text-neutral-300 mb-2">Miniaturas</h4>
          <div className="grid grid-cols-3 gap-3">
            {slides.map((s, idx) => (
              <button
                type="button"
                key={s.index}
                onClick={() => setCurrent(idx)}
                className={`rounded-xl border overflow-hidden ${
                  idx === current ? "border-white" : "border-neutral-800"
                }`}
                title={`Slide ${s.index}`}
              >
                <div className="origin-top-left scale-[0.16] w-[173px] h-[216px]">
                  <SlideCanvas theme={theme} slide={s} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
