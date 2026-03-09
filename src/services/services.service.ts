// src/services/services.service.ts

import satellite from "@/lib/satellite";
import type { ServicesPageData, Service, ProcessStep, PricingPlan } from "@/types/services";
import type { Response } from "@/types/response";

// ─── All (public page) ────────────────────────────────────────────────────────

export const getServicesPageData = async (): Promise<ServicesPageData> => {
  const res = await satellite.get<Response<ServicesPageData>>("/api/services");
  return res.data.data;
};

// ─── Services ─────────────────────────────────────────────────────────────────

export const getServices = async (): Promise<Service[]> => {
  const res = await satellite.get<Response<{ services: Service[] }>>("/api/services/list");
  return res.data.data.services;
};

export const createService = async (data: Omit<Service, "id" | "order">): Promise<Service> => {
  const res = await satellite.post<Response<{ service: Service }>>("/api/services/list", data);
  return res.data.data.service;
};

export const updateService = async (id: string, data: Omit<Service, "id" | "order">): Promise<Service> => {
  const res = await satellite.put<Response<{ service: Service }>>(`/api/services/list/${id}`, data);
  return res.data.data.service;
};

export const toggleServicePublish = async (id: string): Promise<Service> => {
  const res = await satellite.patch<Response<{ service: Service }>>(`/api/services/list/${id}/publish`);
  return res.data.data.service;
};

export const deleteService = async (id: string): Promise<void> => {
  await satellite.delete(`/api/services/list/${id}`);
};

export const reorderServices = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/services/list/reorder", { ids });
};

// ─── Process ──────────────────────────────────────────────────────────────────

export const getProcess = async (): Promise<ProcessStep[]> => {
  const res = await satellite.get<Response<{ process: ProcessStep[] }>>("/api/services/process");
  return res.data.data.process;
};

export const createProcessStep = async (data: Omit<ProcessStep, "id" | "order">): Promise<ProcessStep> => {
  const res = await satellite.post<Response<{ step: ProcessStep }>>("/api/services/process", data);
  return res.data.data.step;
};

export const updateProcessStep = async (id: string, data: Omit<ProcessStep, "id" | "order">): Promise<ProcessStep> => {
  const res = await satellite.put<Response<{ step: ProcessStep }>>(`/api/services/process/${id}`, data);
  return res.data.data.step;
};

export const deleteProcessStep = async (id: string): Promise<void> => {
  await satellite.delete(`/api/services/process/${id}`);
};

export const reorderProcess = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/services/process/reorder", { ids });
};

// ─── Pricing Plans ────────────────────────────────────────────────────────────

export const getPlans = async (): Promise<PricingPlan[]> => {
  const res = await satellite.get<Response<{ plans: PricingPlan[] }>>("/api/services/plans");
  return res.data.data.plans;
};

export const createPlan = async (data: Omit<PricingPlan, "id" | "order">): Promise<PricingPlan> => {
  const res = await satellite.post<Response<{ plan: PricingPlan }>>("/api/services/plans", data);
  return res.data.data.plan;
};

export const updatePlan = async (id: string, data: Omit<PricingPlan, "id" | "order">): Promise<PricingPlan> => {
  const res = await satellite.put<Response<{ plan: PricingPlan }>>(`/api/services/plans/${id}`, data);
  return res.data.data.plan;
};

export const togglePlanPublish = async (id: string): Promise<PricingPlan> => {
  const res = await satellite.patch<Response<{ plan: PricingPlan }>>(`/api/services/plans/${id}/publish`);
  return res.data.data.plan;
};

export const deletePlan = async (id: string): Promise<void> => {
  await satellite.delete(`/api/services/plans/${id}`);
};

export const reorderPlans = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/services/plans/reorder", { ids });
};