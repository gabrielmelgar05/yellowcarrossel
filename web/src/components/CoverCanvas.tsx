import type { CoverConfig } from "../lib/types";

type Props = {
  id?: string;
  value: CoverConfig;
};

export default function CoverCanvas({ id, value }: Props) {
  return (
    <div
      id={id}
      style={{
        width: 1080,
        height: 1350,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Inter, system-ui, Arial",
        backgroundColor: "#000",
        backgroundImage: value.backgroundImage ? `url(${value.backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay para leitura (igual exemplo) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.10) 70%, rgba(0,0,0,0.00) 100%)",
        }}
      />

      {/* barra superior */}
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 70,
          right: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 5,
          color: "#EAEAEA",
          opacity: 0.9,
          fontSize: value.handleSize,
        }}
      >
        <div style={{ color: value.handleColor }}>{value.profileHandle}</div>
        <div style={{ fontSize: Math.max(16, value.handleSize - 2), opacity: 0.85 }}>
          Conteúdo de IA
        </div>
        <div style={{ fontSize: Math.max(16, value.handleSize - 2), opacity: 0.85 }}>
          Copyright © 2025
        </div>
      </div>

      {/* bloco de texto CENTRALIZADO (igual capa referência) */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          bottom: 220,
          zIndex: 5,
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: value.titleColor,
            fontWeight: 900,
            fontSize: value.titleSize,
            lineHeight: 0.95,
            letterSpacing: -0.5,
            textShadow: "0 6px 22px rgba(0,0,0,0.55)",
          }}
        >
          {value.title}
        </div>

        <div
          style={{
            marginTop: 22,
            color: value.subtitleColor,
            fontSize: value.subtitleSize,
            lineHeight: 1.2,
            opacity: 0.95,
            textShadow: "0 6px 22px rgba(0,0,0,0.55)",
          }}
        >
          {value.subtitle}
        </div>
      </div>
    </div>
  );
}
