import axiosInstance from "./axiosInstance";
import handleAxiosError from "./axiosErrorHandler";
import type { Service } from "@/types/Service";

export const fetchServices = async (): Promise<Service[]> => {
  try {
    const response = await axiosInstance.get<Service[]>("/services");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const fetchServiceBySlug = async (slug: string): Promise<Service | null> => {
  try {
    const response = await axiosInstance.get<Service>(`/services/${slug}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return null;
  }
};

export const createService = async (serviceData: any) => {
  try {
    const response = await axiosInstance.post("/services", serviceData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const updateService = async (slug: string, serviceData: any) => {
  try {
    const response = await axiosInstance.put(`/services/${slug}`, serviceData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const deleteService = async (slug: string) => {
  try {
    const response = await axiosInstance.delete(`/services/${slug}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};