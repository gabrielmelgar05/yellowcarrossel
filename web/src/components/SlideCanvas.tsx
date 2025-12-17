import type { CarouselTheme, CarouselSlide } from "../lib/types";

type Props = {
  theme: CarouselTheme;
  slide: CarouselSlide;
};

function TextClamp({
  text,
  fontSize,
  fontWeight,
  lineHeight,
  maxHeight,
  opacity = 1,
}: {
  text: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  maxHeight: number;
  opacity?: number;
}) {
  // corta sem estourar borda + quebra palavras absurdas
  return (
    <div
      style={{
        fontSize,
        fontWeight,
        lineHeight: `${lineHeight}px`,
        maxHeight,
        overflow: "hidden",
        opacity,
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </div>
  );
}

export default function SlideCanvas({ theme, slide }: Props) {
  const PAD_X = 90; // margem lateral bem “premium”
  const TOP_BAR_Y = 64;

  const frameRadius = 64;
  const frameBg = "rgba(220,220,220,0.65)";

  const headerStyle: React.CSSProperties = {
    position: "absolute",
    top: TOP_BAR_Y,
    left: PAD_X,
    right: PAD_X,
    display: "flex",
    justifyContent: "space-between",
    fontSize: 28,
    opacity: 0.9,
  };

  const frame = (
    <div
      style={{
        width: "100%",
        height: slide.frameHeight,
        borderRadius: frameRadius,
        background: frameBg,
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
      }}
    >
      {slide.imageDataUrl ? (
        <img
          src={slide.imageDataUrl}
          alt="Imagem do slide"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${slide.imagePosX}% ${slide.imagePosY}%`,
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            color: "rgba(0,0,0,0.55)",
            fontSize: 44,
            fontWeight: 700,
          }}
        >
          imagem
        </div>
      )}
    </div>
  );

  const textBlock = (
    <div style={{ width: "100%" }}>
      {slide.showTitle && (
        <TextClamp
          text={slide.title}
          fontSize={slide.titleSize}
          fontWeight={900}
          lineHeight={Math.round(slide.titleSize * 0.92)}
          maxHeight={340}
          opacity={0.98}
        />
      )}

      {slide.showSubtitle && slide.subtitle.trim() && (
        <div style={{ marginTop: 18 }}>
          <TextClamp
            text={slide.subtitle}
            fontSize={slide.subtitleSize}
            fontWeight={800}
            lineHeight={Math.round(slide.subtitleSize * 1.05)}
            maxHeight={180}
            opacity={0.92}
          />
        </div>
      )}

      <div style={{ marginTop: 22 }}>
        <TextClamp
          text={slide.body}
          fontSize={slide.bodySize}
          fontWeight={slide.bodyBold ? 800 : 500}
          lineHeight={Math.round(slide.bodySize * 1.25)}
          maxHeight={520}
          opacity={0.9}
        />
      </div>
    </div>
  );

  // Layouts (APENAS OS 2 QUE VOCÊ QUER)
  const content =
    slide.layout === "imageTopTextBottom" ? (
      <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
        {frame}
        {textBlock}
      </div>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
        {textBlock}
        {frame}
      </div>
    );

  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        background: theme.bgColor,
        color: theme.textColor,
        fontFamily: "Inter, system-ui, Arial",
        borderRadius: 52,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={headerStyle}>
        <div>{theme.profileHandle}</div>
        <div style={{ opacity: 0.8 }}>Conteúdo de IA</div>
        <div style={{ opacity: 0.8 }}>Copyright © 2025</div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 180,
          left: PAD_X,
          right: PAD_X,
          bottom: 90,
        }}
      >
        {content}
      </div>
    </div>
  );
}
