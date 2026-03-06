import satellite from "@/lib/satellite";
import type { Feature } from "@/types/feature";
import type { Response } from "@/types/response";

export const getFeatures = async () => {
  const response = await satellite.get<Response<{ features: Feature[] }>>("/api/feature/list");
  return response.data.data.features;
};