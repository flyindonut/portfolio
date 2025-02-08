import axiosInstance from "./axiosInstance";
import handleAxiosError from "./axiosErrorHandler";
import type { Comment } from "@/types/Comment";

export const fetchGuestComments = async (): Promise<Comment[]> => {
  try {
    const response = await axiosInstance.get<Comment[]>("/comments/guest");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const fetchVerifiedComments = async (): Promise<Comment[]> => {
  try {
    const response = await axiosInstance.get<Comment[]>("/comments/verified");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const fetchComments = async (): Promise<Comment[]> => {
  try {
    const response = await axiosInstance.get<Comment[]>("/comments");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const updateCommentStatus = async (commentId: string, status: string): Promise<void> => {
  try {
    await axiosInstance.patch(`/comments/${commentId}/status`, { status });
  } catch (error) {
    handleAxiosError(error);
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/comments/${commentId}`);
  } catch (error) {
    handleAxiosError(error);
  }
};

export const createVerifiedComment = async (comment: Partial<Comment>): Promise<void> => {
  try {
    await axiosInstance.post("/comments/verified", comment);
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateCommentContent = async (commentId: string, content: string): Promise<void> => {
  try {
    await axiosInstance.patch(`/comments/${commentId}/content`, { content });
  } catch (error) {
    handleAxiosError(error);
  }
};

export const addGuestComments = async (comment: Partial<Comment>): Promise<void> => {
  try {
    await axiosInstance.post("/comments/guest", comment);
  } catch (error) {
    handleAxiosError(error);
  }
};