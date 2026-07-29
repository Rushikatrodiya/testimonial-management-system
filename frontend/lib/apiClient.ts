import axios, { AxiosError } from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    headers: { "Content-Type": "application/json" },
});

// Centralized error extraction — runs for every failed request
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ error?: { message: string }; errors?: string[] }>) => {
        const data = error.response?.data;
        const message =
            data?.error?.message ??
            data?.errors?.join(", ") ??
            error.message ??
            "An unexpected error occurred";
        return Promise.reject(new Error(message));
    }
);

export default apiClient;
