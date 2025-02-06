import axiosInstance from "./axiosInstance";
import handleAxiosError from "./axiosErrorHandler";
import type { Project } from "@/types/Project";

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await axiosInstance.get<Project[]>("/projects");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const fetchProjectBySlug = async (slug: string): Promise<Project | null> => {
  try {
    const response = await axiosInstance.get<Project>(`/projects/${slug}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return null;
  }
};

export const createProject = async (projectData: any) => {
  try {
    const response = await axiosInstance.post("/projects", projectData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const updateProject = async (slug: string, projectData: any) => {
  try {
    const response = await axiosInstance.put(`/projects/${slug}`, projectData);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const deleteProject = async (slug: string) => {
  try {
    const response = await axiosInstance.delete(`/projects/${slug}`);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};