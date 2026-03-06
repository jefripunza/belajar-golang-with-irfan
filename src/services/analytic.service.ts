import satellite from "@/lib/satellite";
import type { AnalyticStat } from "@/types/analytic";
import type { Response } from "@/types/response";

export const getAnalytic = async () => {
  const response = await satellite.get<Response<{ stats: AnalyticStat[] }>>("/api/analytic/stats");
  return response.data;
};