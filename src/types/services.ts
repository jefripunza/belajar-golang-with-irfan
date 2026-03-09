// src/types/services.ts

export interface Service {
  id: string;
  icon: string;
  title: string;
  desc: string;
  features: string;   // comma-separated dari backend
  color: string;
  border: string;
  badge: string;
  published: boolean;
  order: number;
}

export interface ProcessStep {
  id: string;
  step: string;
  title: string;
  desc: string;
  order: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string;   // comma-separated dari backend
  cta: string;
  highlight: boolean;
  published: boolean;
  order: number;
}

export interface ServicesPageData {
  services: Service[];
  process:  ProcessStep[];
  plans:    PricingPlan[];
}

// Helpers
export const parseFeatures    = (f: string): string[] => f ? f.split(",").map(x => x.trim()).filter(Boolean) : [];
export const stringifyFeatures = (f: string[]): string => f.join(",");