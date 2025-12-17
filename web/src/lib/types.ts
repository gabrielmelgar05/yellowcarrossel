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

export type CarouselTheme = {
  profileHandle: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
};

export type SlideLayout = "imageTopTextBottom" | "textTopImageBottom";

export type CarouselSlide = {
  index: number;

  // layout
  layout: SlideLayout;

  // toggles
  showTitle: boolean;
  showSubtitle: boolean;
  bodyBold: boolean;

  // content
  title: string;
  subtitle: string;
  body: string;

  // sizes
  titleSize: number;
  subtitleSize: number;
  bodySize: number;

  // image
  imageDataUrl: string | null;
  frameHeight: number; // px
  imagePosX: number; // 0..100
  imagePosY: number; // 0..100
};
