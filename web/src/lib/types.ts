export type CoverConfig = {
  backgroundImage: string | null;

  profileHandle: string;
  handleColor: string;
  handleSize: number;

  title: string;
  titleColor: string;
  titleSize: number;

  subtitle: string;
  subtitleColor: string;
  subtitleSize: number;
};

export type SlideLayout = "imageLeft" | "imageRight" | "imageTop" | "imageBottom";

export type SlideContent = {
  index: number; // 1..9
  title: string;
  subtitle: string;
  bullets: string[];
  layout: SlideLayout;
  imageDataUrl: string | null;
};

export type CarouselTheme = {
  profileHandle: string;
  bgColor: string;      // ex: "#000000"
  textColor: string;    // ex: "#ffffff"
  accentColor: string;  // ex: "#d2b24c" (amarelo)
};

export type CarouselVariant = "black" | "yellow";
