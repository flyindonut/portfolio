import axiosInstance from "./axiosInstance";
import handleAxiosError from "./axiosErrorHandler";
import type { Language } from "@/types/Language";

export const fetchLanguages = async (): Promise<Language[]> => {
  try {
    const response = await axiosInstance.get<Language[]>("/languages");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const createLanguage = async (languageData: any) => {
  try {
    const response = await axiosInstance.post("/languages", languageData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const updateLanguage = async (slug: string, languageData: any) => {
  try {
    const response = await axiosInstance.put(`/languages/${slug}`, languageData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const deleteLanguage = async (slug: string) => {
  try {
    const response = await axiosInstance.delete(`/languages/${slug}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};