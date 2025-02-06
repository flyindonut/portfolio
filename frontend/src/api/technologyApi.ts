import axiosInstance from "./axiosInstance";
import handleAxiosError from "./axiosErrorHandler";
import type { Technology } from "@/types/Technology";

export const fetchTechnologies = async (): Promise<Technology[]> => {
  try {
    const response = await axiosInstance.get<Technology[]>("/technologies");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const createTechnology = async (technologyData: any) => {
  try {
    const response = await axiosInstance.post("/technologies", technologyData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const updateTechnology = async (slug: string, technologyData: any) => {
  try {
    const response = await axiosInstance.put(`/technologies/${slug}`, technologyData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const deleteTechnology = async (slug: string) => {
  try {
    const response = await axiosInstance.delete(`/technologies/${slug}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};