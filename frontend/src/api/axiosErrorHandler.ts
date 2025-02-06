import axios, { AxiosError } from "axios";
import router from "@/router";

interface APIErrorResponse {
  message?: string;
}

const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<APIErrorResponse>;

    const errorMessage = axiosError.response?.data?.message || "An unknown error occurred";
    const statusCode = axiosError.response?.status || 500;

    console.error(`Axios Error: ${errorMessage} (Status: ${statusCode})`);

    if (statusCode === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      router.push("/unauthorized");
    } else if (statusCode === 403) {
      console.warn("Forbidden! Redirecting to forbidden page...");
      router.push("/forbidden");
    } else if (statusCode === 404) {
      console.warn("Resource not found! Redirecting...");
      router.push("/not-found");
    } else if (statusCode >= 500) {
      console.warn("Server error! Redirecting to error page...");
      router.push("/internal-server-error");
    }

    return { error: true, message: errorMessage, statusCode };
  }

  console.error("Non-Axios Error:", error);
  return { error: true, message: "An unexpected error occurred", statusCode: 500 };
};

export default handleAxiosError;
