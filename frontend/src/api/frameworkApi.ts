import axiosInstance from "./axiosInstance";
import handleAxiosError from "./axiosErrorHandler";
import type { Framework } from "@/types/Framework";

export const fetchFrameworks = async (): Promise<Framework[]> => {
  try {
    const response = await axiosInstance.get<Framework[]>("/frameworks");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const createFramework = async (frameworkData: any) => {
  try {
    const response = await axiosInstance.post("/frameworks", frameworkData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const updateFramework = async (slug: string, frameworkData: any) => {
  try {
    const response = await axiosInstance.put(`/frameworks/${slug}`, frameworkData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const deleteFramework = async (slug: string) => {
  try {
    const response = await axiosInstance.delete(`/frameworks/${slug}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};