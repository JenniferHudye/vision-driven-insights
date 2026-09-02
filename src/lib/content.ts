import frameworks from "../../data/frameworks.json";
import pillars from "../../data/pillars.json";
import testimonials from "../../data/testimonials.json";
import caseStudies from "../../data/case-studies.json";
import speaking from "../../data/speaking.json";
import press from "../../data/press.json";
import books from "../../data/books.json";
import courses from "../../data/courses.json";
import awards from "../../data/awards.json";
import trustedBy from "../../data/trusted-by.json";
import faq from "../../data/faq.json";
import posts from "../../data/blog/posts.json";

export interface FaqEntry {
  q: string;
  a: string;
}

export interface Pillar {
  slug: string;
  title: string;
  brandLabel: string;
  tagline: string;
  description: string;
  coreFocus: string;
  subtopics: string[];
  primaryKeyword: string;
  order: number;
}

export interface Framework {
  slug: string;
  name: string;
  shortName: string;
  definition: string;
  principle: string;
  whenUsed: string;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  frameworkSlug: string;
  situation: string;
  outcome: string;
  quote: string;
  featured: boolean;
  type?: string;
  factNote?: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  company: string;
  clientTitle: string;
  location: string;
  frameworkSlug: string;
  frameworkName: string;
  headline: string;
  before: string;
  what_was_done: string;
  results: string[];
  quote: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  category: string;
  pillarSlug: string;
  keywords: string[];
  author: string;
  publishedDate: string;
  modifiedDate: string;
  wordCount: number;
  readingMinutes: number;
  body: string;
  faq: FaqEntry[];
  featuredImage: { src: string; alt: string };
  inArticleImages?: { src: string; alt: string }[];
  isCornerstone?: boolean;
}

export const FRAMEWORKS = (frameworks as Framework[]).sort((a, b) => a.order - b.order);
export const PILLARS = (pillars as Pillar[]).sort((a, b) => a.order - b.order);
export const TESTIMONIALS = testimonials as Testimonial[];
export const CASE_STUDIES = caseStudies as CaseStudy[];
export const SPEAKING = speaking as {
  event: string;
  role: string;
  topic: string;
  year: number | null;
  url: string;
}[];
export const PRESS = press as {
  outlet: string;
  type: string;
  title: string;
  date: string;
  url: string;
}[];
export const BOOKS = books as {
  title: string;
  year: number;
  url: string;
  cover?: string;
}[];
export const COURSES = courses as {
  name: string;
  slug: string;
  for: string;
  covers: string;
  priceNote: string;
  url: string;
  provider: string;
}[];
export const AWARDS = awards as {
  awards: { name: string; year: number; issuer: string }[];
  note: string;
  credentials: string[];
};
export const TRUSTED_BY = trustedBy as {
  intro: string;
  names: string[];
  note: string;
  stat: string;
};
export const FAQ = faq as FaqEntry[];

export const POSTS = (posts as BlogPost[])
  .slice()
  .sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));

export function postsByPillar(pillarSlug: string): BlogPost[] {
  return POSTS.filter((p) => p.pillarSlug === pillarSlug);
}

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getPillar(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}

export function getFramework(slug: string): Framework | undefined {
  return FRAMEWORKS.find((f) => f.slug === slug);
}

export function relatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const sib = POSTS.filter((p) => p.slug !== post.slug && p.pillarSlug === post.pillarSlug);
  if (sib.length >= limit) return sib.slice(0, limit);
  const others = POSTS.filter(
    (p) => p.slug !== post.slug && p.pillarSlug !== post.pillarSlug,
  );
  return [...sib, ...others].slice(0, limit);
}
