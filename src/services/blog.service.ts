// src/services/blog.service.ts

import satellite from "@/lib/satellite";
import type { BlogPageData, BlogPost, BlogAuthor, BlogTopic } from "@/types/blog";
import type { Response } from "@/types/response";

// ─── All (public page) ────────────────────────────────────────────────────────

export const getBlogPageData = async (): Promise<BlogPageData> => {
  const res = await satellite.get<Response<BlogPageData>>("/api/blog");
  return res.data.data;
};

// ─── Posts ────────────────────────────────────────────────────────────────────

export const getPosts = async (): Promise<BlogPost[]> => {
  const res = await satellite.get<Response<{ posts: BlogPost[] }>>("/api/blog/posts");
  return res.data.data.posts;
};

export const createPost = async (data: Omit<BlogPost, "id">): Promise<BlogPost> => {
  const res = await satellite.post<Response<{ post: BlogPost }>>("/api/blog/posts", data);
  return res.data.data.post;
};

export const updatePost = async (id: string, data: Omit<BlogPost, "id">): Promise<BlogPost> => {
  const res = await satellite.put<Response<{ post: BlogPost }>>(`/api/blog/posts/${id}`, data);
  return res.data.data.post;
};

export const togglePostPublish = async (id: string): Promise<BlogPost> => {
  const res = await satellite.patch<Response<{ post: BlogPost }>>(`/api/blog/posts/${id}/publish`);
  return res.data.data.post;
};

export const setFeaturedPost = async (id: string): Promise<BlogPost> => {
  const res = await satellite.patch<Response<{ post: BlogPost }>>(`/api/blog/posts/${id}/featured`);
  return res.data.data.post;
};

export const deletePost = async (id: string): Promise<void> => {
  await satellite.delete(`/api/blog/posts/${id}`);
};

// ─── Authors ──────────────────────────────────────────────────────────────────

export const getAuthors = async (): Promise<BlogAuthor[]> => {
  const res = await satellite.get<Response<{ authors: BlogAuthor[] }>>("/api/blog/authors");
  return res.data.data.authors;
};

export const createAuthor = async (data: Omit<BlogAuthor, "id">): Promise<BlogAuthor> => {
  const res = await satellite.post<Response<{ author: BlogAuthor }>>("/api/blog/authors", data);
  return res.data.data.author;
};

export const updateAuthor = async (id: string, data: Omit<BlogAuthor, "id">): Promise<BlogAuthor> => {
  const res = await satellite.put<Response<{ author: BlogAuthor }>>(`/api/blog/authors/${id}`, data);
  return res.data.data.author;
};

export const deleteAuthor = async (id: string): Promise<void> => {
  await satellite.delete(`/api/blog/authors/${id}`);
};

// ─── Topics ───────────────────────────────────────────────────────────────────

export const getTopics = async (): Promise<BlogTopic[]> => {
  const res = await satellite.get<Response<{ topics: BlogTopic[] }>>("/api/blog/topics");
  return res.data.data.topics;
};

export const createTopic = async (label: string): Promise<BlogTopic> => {
  const res = await satellite.post<Response<{ topic: BlogTopic }>>("/api/blog/topics", { label });
  return res.data.data.topic;
};

export const deleteTopic = async (id: string): Promise<void> => {
  await satellite.delete(`/api/blog/topics/${id}`);
};

export const reorderTopics = async (ids: string[]): Promise<void> => {
  await satellite.put("/api/blog/topics/reorder", { ids });
};