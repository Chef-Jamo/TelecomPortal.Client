import axios from "axios";
import { toast } from "react-toastify";

export const showSuccess = (message: string) => toast.success(message);
export const showError = (message: string) => toast.error(message);
export const showWarning = (message: string) => toast.warning(message);
export const showInfo = (message: string) => toast.info(message);

export const handleError = (
  error: unknown,
  fallbackMessage = "Something went wrong"
) => {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.message;
    showError(responseMessage);
  } else if (error instanceof Error) {
    showError(error.message || fallbackMessage);
  } else {
    showError(fallbackMessage);
  }

  console.error("Handled error:", error);
};
