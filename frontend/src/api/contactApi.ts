import axiosInstance from "./axiosInstance";

export const submitContactForm = async (formData: { name: string; email: string; message: string }) => {
  try {
    const response = await axiosInstance.post("/contact", formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { error: "Failed to send message." };
  }
};
