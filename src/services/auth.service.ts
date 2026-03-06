import satellite from "@/lib/satellite";
import type { IAuthLogin, IAuthRegister } from "@/types/auth";
import type { Response } from "@/types/response";
import type { JwtClaims } from "@/types/user";

export const register = async (data: IAuthRegister) => {
  const response = await satellite.post<Response<void>>(
    "/api/auth/register",
    data,
  );
  return response.data;
};

export const login = async (data: IAuthLogin) => {
  const response = await satellite.post<Response<{ token: string }>>(
    "/api/auth/login",
    data,
  );
  const token = response.data.data?.token;
  return token ?? null;
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
