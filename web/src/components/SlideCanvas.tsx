import type { CarouselTheme, CarouselVariant, SlideContent } from "../lib/types";

type Props = {
  id: string;
  theme: CarouselTheme;
  slide: SlideContent;
  variant: CarouselVariant;
};

export default function SlideCanvas({ id, theme, slide, variant }: Props) {
  const bg = variant === "yellow" ? theme.accentColor : theme.bgColor;
  const text = variant === "yellow" ? "#0b0b0b" : theme.textColor;

  const frameTitle = slide.imageDataUrl ? "Imagem do slide" : "Área de imagem";

  return (
    <div
      id={id}
      style={{
        width: 1080,
        height: 1350,
        background: bg,
        color: text,
        fontFamily: "Inter, system-ui, Arial",
      }}
      className="relative rounded-[36px] overflow-hidden"
    >
      {/* Top bar */}
      <div
        className="absolute left-[80px] right-[80px] top-[56px] flex justify-between opacity-90"
        style={{ fontSize: 26 }}
      >
        <div>{theme.profileHandle}</div>
        <div style={{ opacity: 0.8 }}>Conteúdo de IA</div>
        <div style={{ opacity: 0.8 }}>Copyright © 2025</div>
      </div>

      {/* Conteúdo */}
      <div className="absolute left-[120px] right-[120px] top-[210px] bottom-[120px]">
        {slide.layout === "imageLeft" && (
          <div className="grid grid-cols-[520px_1fr] gap-[70px] items-start">
            <div
              className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-white/10"
              style={{ width: 520, height: 360 }}
              role="img"
              aria-label={frameTitle}
              title={frameTitle}
            >
              {slide.imageDataUrl ? (
                <img src={slide.imageDataUrl} className="w-full h-full object-cover" alt="Imagem do slide" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs opacity-80 px-3 text-center">
                  Área de imagem (o usuário adiciona aqui)
                </div>
              )}
            </div>

            <div>
              <h2 className="font-extrabold leading-[0.92]" style={{ fontSize: 110 }}>
                {slide.title}
              </h2>

              {slide.subtitle ? (
                <div className="mt-[12px] font-semibold opacity-90" style={{ fontSize: 52 }}>
                  {slide.subtitle}
                </div>
              ) : null}

              <div className="mt-[18px] leading-tight opacity-90" style={{ fontSize: 44 }}>
                {slide.bullets.slice(0, 6).map((bullet: string, i: number) => (
                  <div key={i} className="mt-[10px]">
                    • {bullet}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {slide.layout === "imageRight" && (
          <div className="grid grid-cols-[1fr_520px] gap-[70px] items-start">
            <div>
              <h2 className="font-extrabold leading-[0.92]" style={{ fontSize: 110 }}>
                {slide.title}
              </h2>

              {slide.subtitle ? (
                <div className="mt-[12px] font-semibold opacity-90" style={{ fontSize: 52 }}>
                  {slide.subtitle}
                </div>
              ) : null}

              <div className="mt-[18px] leading-tight opacity-90" style={{ fontSize: 44 }}>
                {slide.bullets.slice(0, 6).map((bullet: string, i: number) => (
                  <div key={i} className="mt-[10px]">
                    • {bullet}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-white/10"
              style={{ width: 520, height: 360 }}
              role="img"
              aria-label={frameTitle}
              title={frameTitle}
            >
              {slide.imageDataUrl ? (
                <img src={slide.imageDataUrl} className="w-full h-full object-cover" alt="Imagem do slide" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs opacity-80 px-3 text-center">
                  Área de imagem (o usuário adiciona aqui)
                </div>
              )}
            </div>
          </div>
        )}

        {slide.layout === "imageBottom" && (
          <div className="grid grid-rows-[auto_1fr] gap-[70px]">
            <div>
              <h2 className="font-extrabold leading-[0.92]" style={{ fontSize: 120 }}>
                {slide.title}
              </h2>

              {slide.subtitle ? (
                <div className="mt-[10px] font-semibold opacity-90" style={{ fontSize: 56 }}>
                  {slide.subtitle}
                </div>
              ) : null}

              <div className="mt-[18px] leading-tight opacity-90" style={{ fontSize: 46 }}>
                {slide.bullets.slice(0, 6).map((bullet: string, i: number) => (
                  <div key={i} className="mt-[10px]">
                    • {bullet}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-white/10"
              style={{ width: "100%", height: 620 }}
              role="img"
              aria-label={frameTitle}
              title={frameTitle}
            >
              {slide.imageDataUrl ? (
                <img src={slide.imageDataUrl} className="w-full h-full object-cover" alt="Imagem do slide" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs opacity-80 px-3 text-center">
                  Área de imagem (o usuário adiciona aqui)
                </div>
              )}
            </div>
          </div>
        )}

        {slide.layout === "imageTop" && (
          <div className="grid grid-rows-[620px_1fr] gap-[70px]">
            <div
              className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-white/10"
              style={{ width: "100%", height: 620 }}
              role="img"
              aria-label={frameTitle}
              title={frameTitle}
            >
              {slide.imageDataUrl ? (
                <img src={slide.imageDataUrl} className="w-full h-full object-cover" alt="Imagem do slide" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs opacity-80 px-3 text-center">
                  Área de imagem (o usuário adiciona aqui)
                </div>
              )}
            </div>

            <div>
              <h2 className="font-extrabold leading-[0.92]" style={{ fontSize: 120 }}>
                {slide.title}
              </h2>

              {slide.subtitle ? (
                <div className="mt-[10px] font-semibold opacity-90" style={{ fontSize: 56 }}>
                  {slide.subtitle}
                </div>
              ) : null}

              <div className="mt-[18px] leading-tight opacity-90" style={{ fontSize: 46 }}>
                {slide.bullets.slice(0, 6).map((bullet: string, i: number) => (
                  <div key={i} className="mt-[10px]">
                    • {bullet}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
