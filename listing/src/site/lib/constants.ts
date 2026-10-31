import { HOME_PAGE_CONTENT } from '@/site/data/content/home.content';

export const SLIDE_DURATION_MS = HOME_PAGE_CONTENT.hero.slideDurationMs || 2200;
export const TOTAL_SLIDES = HOME_PAGE_CONTENT.hero.slides.length || 3;
export const ALLOW_SKIP_INTRO = false;
export const PERSIST_HERO_COMPLETED = true;

export interface HeroSlideData {
  id: number;
  image: string;
  tagline: string;
  subtext: string;
  alt: string;
}

export const HERO_SLIDES: HeroSlideData[] = HOME_PAGE_CONTENT.hero.slides.map((s) => ({
  id: s.id,
  image: s.image,
  tagline: s.tagline,
  subtext: s.subtext,
  alt: s.alt,
}));
