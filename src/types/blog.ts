// src/types/blog.ts

export interface BlogPost {
  id: string;
  emoji: string;
  category: string;
  badge: string;
  title: string;
  desc: string;
  author: string;
  author_emoji: string;
  role: string;
  date: string;
  read_time: string;
  color: string;
  featured: boolean;
  published: boolean;
}

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  emoji: string;
}

export interface BlogTopic {
  id: string;
  label: string;
  order: number;
}

export interface BlogPageData {
  posts:   BlogPost[];
  authors: BlogAuthor[];
  topics:  BlogTopic[];
}