// src/services/about.service.ts

import satellite from "@/lib/satellite";
import type { AboutPageData, TeamMember, CompanyValue, CompanyStat, PageContent } from "@/types/about";
import type { Response } from "@/types/response";

// ─── All (public page) ────────────────────────────────────────────────────────

export const getAboutPageData = async (): Promise<AboutPageData> => {
  const res = await satellite.get<Response<AboutPageData>>("/api/about");
  return res.data.data;
};

// ─── Team ─────────────────────────────────────────────────────────────────────

export const getTeam = async (): Promise<TeamMember[]> => {
  const res = await satellite.get<Response<{ team: TeamMember[] }>>("/api/about/team");
  return res.data.data.team;
};

export const createTeamMember = async (
  data: Omit<TeamMember, "id" | "order">
): Promise<TeamMember> => {
  const res = await satellite.post<Response<{ member: TeamMember }>>("/api/about/team", data);
  return res.data.data.member;
};

export const updateTeamMember = async (
  id: string,
  data: Omit<TeamMember, "id" | "order">
): Promise<TeamMember> => {
  const res = await satellite.put<Response<{ member: TeamMember }>>(`/api/about/team/${id}`, data);
  return res.data.data.member;
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  await satellite.delete(`/api/about/team/${id}`);
};

export const reorderTeam = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/about/team/reorder", { ids });
};

// ─── Values ───────────────────────────────────────────────────────────────────

export const getValues = async (): Promise<CompanyValue[]> => {
  const res = await satellite.get<Response<{ values: CompanyValue[] }>>("/api/about/values");
  return res.data.data.values;
};

export const createValue = async (
  data: Omit<CompanyValue, "id" | "order">
): Promise<CompanyValue> => {
  const res = await satellite.post<Response<{ value: CompanyValue }>>("/api/about/values", data);
  return res.data.data.value;
};

export const updateValue = async (
  id: string,
  data: Omit<CompanyValue, "id" | "order">
): Promise<CompanyValue> => {
  const res = await satellite.put<Response<{ value: CompanyValue }>>(`/api/about/values/${id}`, data);
  return res.data.data.value;
};

export const deleteValue = async (id: string): Promise<void> => {
  await satellite.delete(`/api/about/values/${id}`);
};

export const reorderValues = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/about/values/reorder", { ids });
};

// ─── Stats ────────────────────────────────────────────────────────────────────

export const getStats = async (): Promise<CompanyStat[]> => {
  const res = await satellite.get<Response<{ stats: CompanyStat[] }>>("/api/about/stats");
  return res.data.data.stats;
};

export const createStat = async (
  data: Omit<CompanyStat, "id" | "order">
): Promise<CompanyStat> => {
  const res = await satellite.post<Response<{ stat: CompanyStat }>>("/api/about/stats", data);
  return res.data.data.stat;
};

export const updateStat = async (
  id: string,
  data: Omit<CompanyStat, "id" | "order">
): Promise<CompanyStat> => {
  const res = await satellite.put<Response<{ stat: CompanyStat }>>(`/api/about/stats/${id}`, data);
  return res.data.data.stat;
};

export const deleteStat = async (id: string): Promise<void> => {
  await satellite.delete(`/api/about/stats/${id}`);
};

export const reorderStats = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/about/stats/reorder", { ids });
};

// ─── Page Content ─────────────────────────────────────────────────────────────

export const getContent = async (): Promise<PageContent> => {
  const res = await satellite.get<Response<{ content: PageContent }>>("/api/about/content");
  return res.data.data.content;
};

export const updateContent = async (data: Partial<PageContent>): Promise<void> => {
  await satellite.put("/api/about/content", data);
};