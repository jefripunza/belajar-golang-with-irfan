import satellite from "@/lib/satellite";
import type { IAuthLogin } from "@/types/auth";
import type { Response } from "@/types/response";
import type { JwtClaims } from "@/types/user";

export const login = async (data: IAuthLogin) => {
  const response = await satellite.post<Response<{ token: string }>>(
    "/api/auth/login",
    data,
  );
  return response.data.data.token;
};

export const validate = async () => {
  const response =
    await satellite.get<Response<{ claims: JwtClaims }>>("/api/auth/validate");
  return response.data;
};

export const logout = async () => {
  const response = await satellite.delete<Response<void>>("/api/auth/logout");
  return response.data;
};
