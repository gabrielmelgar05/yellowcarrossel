import type { CarouselSlide, CarouselTheme } from "../lib/types";

type Props = {
  id?: string;
  slide: CarouselSlide;
  theme: CarouselTheme;
};

export default function CarouselSlideCanvas({ id, slide, theme }: Props) {
  const isEven = slide.index % 2 === 0;

  const frameStyle: React.CSSProperties = {
    background: theme.backgroundColor,
    width: 1080,
    height: 1350,
    position: "relative",
    overflow: "hidden",
    fontFamily: "Inter, system-ui, Arial",
  };

  const topBarStyle: React.CSSProperties = {
    position: "absolute",
    top: 44,
    left: 70,
    right: 70,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: theme.textColor,
    opacity: 0.9,
    fontSize: 18,
    zIndex: 10,
  };

  const contentWrap: React.CSSProperties = {
    position: "absolute",
    top: 150,
    left: 70,
    right: 70,
    bottom: 70,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 44,
    alignItems: "start",
  };

  const imageBox: React.CSSProperties = {
    width: "100%",
    height: 520,
    borderRadius: 28,
    overflow: "hidden",
    background: "rgba(255,255,255,0.06)",
    border: `2px solid rgba(255,255,255,0.12)`,
    boxShadow: "0 30px 70px rgba(0,0,0,0.35)",
  };

  const placeholder: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.textColor,
    opacity: 0.75,
    fontSize: 18,
    padding: 24,
    textAlign: "center",
  };

  const headingStyle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: 92,
    letterSpacing: -1,
    lineHeight: 0.95,
    marginBottom: 18,
    color: theme.textColor,
  };

  const subheadingStyle: React.CSSProperties = {
    fontWeight: 800,
    fontSize: 40,
    marginBottom: 22,
    color: theme.textColor,
    opacity: 0.95,
  };

  const bodyStyle: React.CSSProperties = {
    fontSize: 30,
    lineHeight: 1.28,
    color: theme.textColor,
    opacity: 0.92,
    whiteSpace: "pre-wrap",
  };

  const accentRule: React.CSSProperties = {
    width: 140,
    height: 10,
    borderRadius: 999,
    background: theme.accentColor,
    marginBottom: 22,
    opacity: 0.95,
  };

  const imageNode = (
    <div style={imageBox}>
      {slide.imageDataUrl ? (
        <img
          src={slide.imageDataUrl}
          alt={`Imagem do slide ${slide.index}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div style={placeholder}>Área de imagem (o usuário adiciona aqui)</div>
      )}
    </div>
  );

  const textNode = (
    <div>
      <div style={headingStyle}>{slide.heading}</div>
      <div style={accentRule} />
      {slide.subheading ? <div style={subheadingStyle}>{slide.subheading}</div> : null}
      <div style={bodyStyle}>{slide.body}</div>
    </div>
  );

  return (
    <div id={id} style={frameStyle}>
      <div style={topBarStyle}>
        <div style={{ color: theme.textColor }}>{theme.profileHandle}</div>
        <div style={{ opacity: 0.85 }}>Conteúdo de IA</div>
        <div style={{ opacity: 0.85 }}>Copyright © 2025</div>
      </div>

      <div style={contentWrap}>
        {isEven ? (
          <>
            {textNode}
            {imageNode}
          </>
        ) : (
          <>
            {imageNode}
            {textNode}
          </>
        )}
      </div>
    </div>
  );
}
