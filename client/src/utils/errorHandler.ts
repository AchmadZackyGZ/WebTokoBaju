// utils/errorHandler.ts
import axios, { AxiosError } from "axios";

export const handleAxiosError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ message?: string }>;
    return err.response?.data?.message || "Terjadi kesalahan pada server";
  }

  return "Terjadi kesalahan tak terduga";
};
