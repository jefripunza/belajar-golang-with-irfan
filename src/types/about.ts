// src/types/about.ts

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  emoji: string;
  order: number;
}

export interface CompanyValue {
  id: string;
  icon: string;
  title: string;
  desc: string;
  order: number;
}

export interface CompanyStat {
  id: string;
  value: string;
  label: string;
  order: number;
}

export interface PageContent {
  hero_badge: string;
  hero_headline: string;
  hero_headline_highlight: string;
  hero_subtext: string;
  story_paragraph1: string;
  story_paragraph2: string;
  story_paragraph3: string;
}

export interface AboutPageData {
  team: TeamMember[];
  values: CompanyValue[];
  stats: CompanyStat[];
  content: PageContent;
}