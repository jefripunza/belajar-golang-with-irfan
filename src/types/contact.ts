// src/types/contact.ts

export interface ContactCard {
  id: string;
  icon: string;
  title: string;
  desc: string;
  value: string;
  color: string;
  border: string;
  order: number;
}

export interface OfficeHour {
  id: string;
  day: string;
  time: string;
  order: number;
}

export interface ResponseTime {
  id: string;
  label: string;
  time: string;
  bar: string;
  order: number;
}

export interface Social {
  id: string;
  name: string;
  emoji: string;
  url: string;
  order: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface ContactPageData {
  contact_cards: ContactCard[];
  office_hours: OfficeHour[];
  response_times: ResponseTime[];
  socials: Social[];
  faqs: FAQ[];
}