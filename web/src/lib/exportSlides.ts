import * as htmlToImage from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function exportSlidesToZip(options: {
  ids: string[];          // ids dos elementos 1080x1350
  zipName?: string;       // nome do zip
  filePrefix?: string;    // slide-01, slide-02...
}): Promise<void> {
  const zip = new JSZip();
  const zipName = options.zipName ?? "carrossel_1080x1350.zip";
  const prefix = options.filePrefix ?? "slide";

  for (let i = 0; i < options.ids.length; i++) {
    const id = options.ids[i];
    const el = document.getElementById(id);
    if (!el) throw new Error(`Elemento não encontrado: #${id}`);

    // Gera PNG a partir do DOM (render real 1080x1350)
    const dataUrl = await htmlToImage.toPng(el, {
      cacheBust: true,
      pixelRatio: 2, // aumenta qualidade
    });

    const base64 = dataUrl.split(",")[1];
    const filename = `${prefix}-${String(i + 1).padStart(2, "0")}.png`;
    zip.file(filename, base64, { base64: true });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, zipName);
}
