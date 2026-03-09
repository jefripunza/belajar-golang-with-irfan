// src/services/portfolio.service.ts

import satellite from "@/lib/satellite";
import type { PortfolioPageData, Project, Testimonial } from "@/types/portfolio";
import type { Response } from "@/types/response";

// ─── All (public page) ────────────────────────────────────────────────────────

export const getPortfolioPageData = async (): Promise<PortfolioPageData> => {
  const res = await satellite.get<Response<PortfolioPageData>>("/api/portfolio");
  return res.data.data;
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const getProjects = async (): Promise<Project[]> => {
  const res = await satellite.get<Response<{ projects: Project[] }>>("/api/portfolio/projects");
  return res.data.data.projects;
};

export const createProject = async (
  data: Omit<Project, "id" | "order">
): Promise<Project> => {
  const res = await satellite.post<Response<{ project: Project }>>("/api/portfolio/projects", data);
  return res.data.data.project;
};

export const updateProject = async (
  id: string,
  data: Omit<Project, "id" | "order">
): Promise<Project> => {
  const res = await satellite.put<Response<{ project: Project }>>(`/api/portfolio/projects/${id}`, data);
  return res.data.data.project;
};

export const togglePublish = async (id: string): Promise<Project> => {
  const res = await satellite.patch<Response<{ project: Project }>>(`/api/portfolio/projects/${id}/publish`);
  return res.data.data.project;
};

export const deleteProject = async (id: string): Promise<void> => {
  await satellite.delete(`/api/portfolio/projects/${id}`);
};

export const reorderProjects = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/portfolio/projects/reorder", { ids });
};

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const res = await satellite.get<Response<{ testimonials: Testimonial[] }>>("/api/portfolio/testimonials");
  return res.data.data.testimonials;
};

export const createTestimonial = async (
  data: Omit<Testimonial, "id" | "order">
): Promise<Testimonial> => {
  const res = await satellite.post<Response<{ testimonial: Testimonial }>>("/api/portfolio/testimonials", data);
  return res.data.data.testimonial;
};

export const updateTestimonial = async (
  id: string,
  data: Omit<Testimonial, "id" | "order">
): Promise<Testimonial> => {
  const res = await satellite.put<Response<{ testimonial: Testimonial }>>(`/api/portfolio/testimonials/${id}`, data);
  return res.data.data.testimonial;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await satellite.delete(`/api/portfolio/testimonials/${id}`);
};

export const reorderTestimonials = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/portfolio/testimonials/reorder", { ids });
};