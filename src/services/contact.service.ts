// src/services/contact.service.ts

import satellite from "@/lib/satellite";
import type {
  ContactCard,
  OfficeHour,
  ResponseTime,
  Social,
  FAQ,
  ContactPageData,
} from "@/types/contact";
import type { Response } from "@/types/response";

// ─── All (public page) ────────────────────────────────────────────────────────

export const getContactPageData = async (): Promise<ContactPageData> => {
  const res = await satellite.get<Response<ContactPageData>>("/api/contact");
  return res.data.data;
};

// ─── Contact Cards ────────────────────────────────────────────────────────────

export const getContactCards = async (): Promise<ContactCard[]> => {
  const res = await satellite.get<Response<{ contact_cards: ContactCard[] }>>("/api/contact/cards");
  return res.data.data.contact_cards;
};

export const createContactCard = async (
  data: Omit<ContactCard, "id" | "order">
): Promise<ContactCard> => {
  const res = await satellite.post<Response<{ contact_card: ContactCard }>>("/api/contact/cards", data);
  return res.data.data.contact_card;
};

export const updateContactCard = async (
  id: string,
  data: Omit<ContactCard, "id" | "order">
): Promise<ContactCard> => {
  const res = await satellite.put<Response<{ contact_card: ContactCard }>>(`/api/contact/cards/${id}`, data);
  return res.data.data.contact_card;
};

export const deleteContactCard = async (id: string): Promise<void> => {
  await satellite.delete(`/api/contact/cards/${id}`);
};

export const reorderContactCards = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/contact/cards/reorder", { ids });
};

// ─── Office Hours ─────────────────────────────────────────────────────────────

export const getOfficeHours = async (): Promise<OfficeHour[]> => {
  const res = await satellite.get<Response<{ office_hours: OfficeHour[] }>>("/api/contact/hours");
  return res.data.data.office_hours;
};

export const createOfficeHour = async (
  data: Omit<OfficeHour, "id" | "order">
): Promise<OfficeHour> => {
  const res = await satellite.post<Response<{ office_hour: OfficeHour }>>("/api/contact/hours", data);
  return res.data.data.office_hour;
};

export const updateOfficeHour = async (
  id: string,
  data: Omit<OfficeHour, "id" | "order">
): Promise<OfficeHour> => {
  const res = await satellite.put<Response<{ office_hour: OfficeHour }>>(`/api/contact/hours/${id}`, data);
  return res.data.data.office_hour;
};

export const deleteOfficeHour = async (id: string): Promise<void> => {
  await satellite.delete(`/api/contact/hours/${id}`);
};

export const reorderOfficeHours = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/contact/hours/reorder", { ids });
};

// ─── Response Times ───────────────────────────────────────────────────────────

export const getResponseTimes = async (): Promise<ResponseTime[]> => {
  const res = await satellite.get<Response<{ response_times: ResponseTime[] }>>("/api/contact/response-times");
  return res.data.data.response_times;
};

export const createResponseTime = async (
  data: Omit<ResponseTime, "id" | "order">
): Promise<ResponseTime> => {
  const res = await satellite.post<Response<{ response_time: ResponseTime }>>("/api/contact/response-times", data);
  return res.data.data.response_time;
};

export const updateResponseTime = async (
  id: string,
  data: Omit<ResponseTime, "id" | "order">
): Promise<ResponseTime> => {
  const res = await satellite.put<Response<{ response_time: ResponseTime }>>(`/api/contact/response-times/${id}`, data);
  return res.data.data.response_time;
};

export const deleteResponseTime = async (id: string): Promise<void> => {
  await satellite.delete(`/api/contact/response-times/${id}`);
};

export const reorderResponseTimes = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/contact/response-times/reorder", { ids });
};

// ─── Socials ──────────────────────────────────────────────────────────────────

export const getSocials = async (): Promise<Social[]> => {
  const res = await satellite.get<Response<{ socials: Social[] }>>("/api/contact/socials");
  return res.data.data.socials;
};

export const createSocial = async (
  data: Omit<Social, "id" | "order">
): Promise<Social> => {
  const res = await satellite.post<Response<{ social: Social }>>("/api/contact/socials", data);
  return res.data.data.social;
};

export const updateSocial = async (
  id: string,
  data: Omit<Social, "id" | "order">
): Promise<Social> => {
  const res = await satellite.put<Response<{ social: Social }>>(`/api/contact/socials/${id}`, data);
  return res.data.data.social;
};

export const deleteSocial = async (id: string): Promise<void> => {
  await satellite.delete(`/api/contact/socials/${id}`);
};

export const reorderSocials = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/contact/socials/reorder", { ids });
};

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export const getFAQs = async (): Promise<FAQ[]> => {
  const res = await satellite.get<Response<{ faqs: FAQ[] }>>("/api/contact/faqs");
  return res.data.data.faqs;
};

export const createFAQ = async (
  data: Omit<FAQ, "id" | "order">
): Promise<FAQ> => {
  const res = await satellite.post<Response<{ faq: FAQ }>>("/api/contact/faqs", data);
  return res.data.data.faq;
};

export const updateFAQ = async (
  id: string,
  data: Omit<FAQ, "id" | "order">
): Promise<FAQ> => {
  const res = await satellite.put<Response<{ faq: FAQ }>>(`/api/contact/faqs/${id}`, data);
  return res.data.data.faq;
};

export const deleteFAQ = async (id: string): Promise<void> => {
  await satellite.delete(`/api/contact/faqs/${id}`);
};

export const reorderFAQs = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/contact/faqs/reorder", { ids });
};