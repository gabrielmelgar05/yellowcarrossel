import type { CoverConfig } from "../lib/types";
import CoverCanvas from "./CoverCanvas";

type Props = {
  value: CoverConfig;
  onChange: (v: CoverConfig) => void;
  onApprove: () => void;
};

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function CoverEditor({ value, onChange, onApprove }: Props) {
  return (
    <div className="grid lg:grid-cols-[420px_1fr] gap-6">
      {/* Painel */}
      <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
        <h2 className="font-semibold text-lg">CAPA (obrigatória)</h2>
        <p className="text-sm text-neutral-400 mt-1">
          Aqui você define: fundo, @perfil, título, subtítulo, cores e tamanho por slider.
        </p>

        <div className="mt-4 space-y-4">
          {/* Imagem de fundo */}
          <div>
            <label htmlFor="cover-bg" className="text-sm text-neutral-300">
              Imagem de fundo
            </label>

            <input
              id="cover-bg"
              className="mt-2 block w-full text-sm"
              type="file"
              accept="image/*"
              aria-label="Selecionar imagem de fundo da capa"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await readFileAsDataURL(f);
                onChange({ ...value, backgroundImage: url });
              }}
            />
          </div>

          {/* @ perfil + tamanho */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cover-handle" className="text-sm text-neutral-300">
                @ do perfil
              </label>
              <input
                id="cover-handle"
                value={value.profileHandle}
                onChange={(e) => onChange({ ...value, profileHandle: e.target.value })}
                className="mt-2 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm"
                placeholder="@nomedoperfil"
                aria-label="Nome do perfil na capa"
              />
            </div>

            <div>
              <label htmlFor="cover-handle-size" className="text-sm text-neutral-300">
                Tamanho @
              </label>
              <input
                id="cover-handle-size"
                type="range"
                min={12}
                max={30}
                value={value.handleSize}
                onChange={(e) => onChange({ ...value, handleSize: Number(e.target.value) })}
                className="mt-3 w-full"
                aria-label="Ajustar tamanho do @ do perfil"
              />
            </div>
          </div>

          {/* Cor do @ */}
          <div>
            <label htmlFor="cover-handle-color" className="text-sm text-neutral-300">
              Cor do @
            </label>
            <input
              id="cover-handle-color"
              type="color"
              value={value.handleColor}
              onChange={(e) => onChange({ ...value, handleColor: e.target.value })}
              className="mt-2 w-full h-10 rounded-lg bg-neutral-950 border border-neutral-800"
              aria-label="Selecionar cor do @ do perfil"
            />
          </div>

          {/* Título */}
          <div>
            <label htmlFor="cover-title" className="text-sm text-neutral-300">
              Título (bold)
            </label>
            <textarea
              id="cover-title"
              value={value.title}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
              className="mt-2 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm min-h-[70px]"
              aria-label="Texto do título da capa"
            />

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label htmlFor="cover-title-color" className="text-sm text-neutral-300">
                  Cor do título
                </label>
                <input
                  id="cover-title-color"
                  type="color"
                  value={value.titleColor}
                  onChange={(e) => onChange({ ...value, titleColor: e.target.value })}
                  className="mt-2 w-full h-10 rounded-lg bg-neutral-950 border border-neutral-800"
                  aria-label="Selecionar cor do título"
                />
              </div>

              <div>
                <label htmlFor="cover-title-size" className="text-sm text-neutral-300">
                  Tamanho do título
                </label>
                <input
                  id="cover-title-size"
                  type="range"
                  min={40}
                  max={120}
                  value={value.titleSize}
                  onChange={(e) => onChange({ ...value, titleSize: Number(e.target.value) })}
                  className="mt-3 w-full"
                  aria-label="Ajustar tamanho do título"
                />
              </div>
            </div>
          </div>

          {/* Subtítulo */}
          <div>
            <label htmlFor="cover-subtitle" className="text-sm text-neutral-300">
              Subtítulo
            </label>
            <textarea
              id="cover-subtitle"
              value={value.subtitle}
              onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
              className="mt-2 w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm min-h-[70px]"
              aria-label="Texto do subtítulo da capa"
            />

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label htmlFor="cover-subtitle-color" className="text-sm text-neutral-300">
                  Cor do subtítulo
                </label>
                <input
                  id="cover-subtitle-color"
                  type="color"
                  value={value.subtitleColor}
                  onChange={(e) => onChange({ ...value, subtitleColor: e.target.value })}
                  className="mt-2 w-full h-10 rounded-lg bg-neutral-950 border border-neutral-800"
                  aria-label="Selecionar cor do subtítulo"
                />
              </div>

              <div>
                <label htmlFor="cover-subtitle-size" className="text-sm text-neutral-300">
                  Tamanho do subtítulo
                </label>
                <input
                  id="cover-subtitle-size"
                  type="range"
                  min={18}
                  max={60}
                  value={value.subtitleSize}
                  onChange={(e) => onChange({ ...value, subtitleSize: Number(e.target.value) })}
                  className="mt-3 w-full"
                  aria-label="Ajustar tamanho do subtítulo"
                />
              </div>
            </div>
          </div>

          {/* Botão */}
          <div className="pt-2">
            <button
              onClick={onApprove}
              className="w-full rounded-xl bg-white text-black px-4 py-3 font-semibold"
            >
              Aprovar CAPA e ir para CARROSSEL →
            </button>
          </div>
        </div>
      </div>

      {/* Preview: SEMPRE 1080x1350 e só escala */}
      <div className="flex items-start justify-center">
        <div className="border border-neutral-800 rounded-2xl shadow-2xl bg-neutral-950 overflow-hidden">
          <div
            style={{
              width: 1080,
              height: 1350,
              transform: "scale(0.33)", // ajuste aqui: 0.33 ~ 360px de largura
              transformOrigin: "top left",
            }}
          >
            <CoverCanvas value={value} />
          </div>
        </div>
      </div>
    </div>
  );
}
