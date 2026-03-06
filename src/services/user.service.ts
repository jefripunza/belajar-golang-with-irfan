import satellite from "@/lib/satellite";
import type { User } from "@/types/user";
import type { Response } from "@/types/response";

export const getMe = async () => {
  const response =
    await satellite.get<Response<{ user: User }>>("/api/user/me");
  return response.data.data.user;
};
