// App.tsx

import { useMemo, useState } from "react";
import CoverEditor from "./components/CoverEditor";
import CarouselEditor from "./components/CarouselEditor";
import type { CoverConfig } from "./lib/types";

type Step = "cover" | "carousel";

const DEFAULT_COVER: CoverConfig = {
  backgroundImage: null,
  profileHandle: "@nomedoperfil",
  handleColor: "#ffffff",
  handleSize: 18,

  title: "Não conte comigo\npara nada!",
  titleColor: "#ffffff",
  titleSize: 92,

  subtitle:
    "por que o alívio de ficar de fora pode ser a\n tendência cultural mais libertadora do momento",
  subtitleColor: "#e5e5e5",
  subtitleSize: 30,
};

export default function App() {
  const [step, setStep] = useState<Step>("cover");
  const [cover, setCover] = useState<CoverConfig>(DEFAULT_COVER);
  const [coverApproved, setCoverApproved] = useState(false);

  const canGoCarousel = useMemo(() => coverApproved, [coverApproved]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-extrabold">Gerador de Carrossel (1080×1350)</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Fluxo obrigatório: <span className="text-neutral-200">Capa → Carrossel</span>
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setStep("cover")}
            className={`px-3 py-2 rounded-lg border ${
              step === "cover"
                ? "bg-white text-black border-white"
                : "bg-neutral-950 text-white border-neutral-800"
            }`}
          >
            1) CAPA
          </button>

          <button
            onClick={() => {
              if (!canGoCarousel) return;
              setStep("carousel");
            }}
            className={`px-3 py-2 rounded-lg border ${
              step === "carousel"
                ? "bg-white text-black border-white"
                : "bg-neutral-950 text-white border-neutral-800"
            } ${!canGoCarousel ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-disabled={!canGoCarousel}
            title={!canGoCarousel ? "Aprove a CAPA primeiro" : "Ir para carrossel"}
          >
            2) CARROSSEL
          </button>
        </div>

        <div className="mt-6">
          {step === "cover" ? (
            <CoverEditor
              value={cover}
              onChange={setCover}
              onApprove={() => {
                setCoverApproved(true);
                setStep("carousel");
              }}
            />
          ) : (
            <CarouselEditor />
          )}
        </div>
      </div>
    </div>
  );
}
