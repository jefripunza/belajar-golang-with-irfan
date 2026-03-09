// src/types/portfolio.ts

export interface Project {
  id: string;
  emoji: string;
  title: string;
  category: string;
  desc: string;
  tags: string;        // comma-separated dari backend, parse di frontend
  result: string;
  color: string;
  border: string;
  badge: string;
  published: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  emoji: string;
  text: string;
  order: number;
}

export interface PortfolioPageData {
  projects: Project[];
  testimonials: Testimonial[];
}

// Helper: parse tags string → array
export const parseTags = (tags: string): string[] =>
  tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];

// Helper: array tags → string
export const stringifyTags = (tags: string[]): string => tags.join(",");