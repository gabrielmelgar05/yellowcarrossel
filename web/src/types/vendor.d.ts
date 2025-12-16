declare module "html-to-image" {
  export type Options = {
    width?: number;
    height?: number;
    backgroundColor?: string;
    style?: Record<string, string>;
    filter?: (domNode: HTMLElement) => boolean;
    quality?: number;
    cacheBust?: boolean;
    pixelRatio?: number;
    imagePlaceholder?: string;
    skipAutoScale?: boolean;
    canvasWidth?: number;
    canvasHeight?: number;
    includeQueryParams?: boolean;
    fontEmbedCSS?: string;
  };

  export function toPng(node: HTMLElement, options?: Options): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  export function toSvg(node: HTMLElement, options?: Options): Promise<string>;
  export function toBlob(node: HTMLElement, options?: Options): Promise<Blob | null>;
  export function toCanvas(node: HTMLElement, options?: Options): Promise<HTMLCanvasElement>;
  export function getFontEmbedCSS(node: HTMLElement): Promise<string>;
}
