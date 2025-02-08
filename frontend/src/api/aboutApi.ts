import axiosInstance from "./axiosInstance";
import handleAxiosError from "./axiosErrorHandler";
import type { About } from "@/types/About";

export const fetchAbouts = async (): Promise<About[]> => {
  try {
    const response = await axiosInstance.get<About[]>("/about");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const fetchAboutBySlug = async (slug: string): Promise<About | null> => {
  try {
    const response = await axiosInstance.get<About>(`/about/${slug}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return null;
  }
};

export const createAbout = async (aboutData: any) => {
  try {
    const response = await axiosInstance.post("/about", aboutData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const updateAbout = async (slug: string, aboutData: any) => {
  try {
    const response = await axiosInstance.put(`/about/${slug}`, aboutData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const deleteAbout = async (slug: string) => {
  try {
    const response = await axiosInstance.delete(`/about/${slug}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};