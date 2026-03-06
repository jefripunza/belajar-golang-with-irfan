import satellite from "@/lib/satellite";
import type { User } from "@/types/user";
import type { Response } from "@/types/response";

export const getMe = async () => {
  const response =
    await satellite.get<Response<{ user: User }>>("/api/user/me");
  return response.data.data.user;
};

// TODO: Management

export const getAllUsers = async () => {
  const response = await satellite.get<Response<{ users: User[] }>>(
    "/api/user/manage/all",
  );
  return response.data.data.users;
};

export const editUser = async (id: string, data: Partial<User>) => {
  const response = await satellite.put<Response<{ user: User }>>(
    `/api/user/manage/${id}`,
    data,
  );
  return response.data.data.user;
};

export const removeUser = async (id: string) => {
  const response = await satellite.delete<Response<unknown>>(
    `/api/user/manage/${id}`,
  );
  return response.data.data;
};
