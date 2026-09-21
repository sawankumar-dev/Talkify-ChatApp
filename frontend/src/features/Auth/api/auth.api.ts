import apiClient from "@/config/apiClient";
import type { RegisterUserInput } from "../types/auth.types";

export const registerUserApi = async (userData: RegisterUserInput) => {
    try {
        const response = await apiClient.post("/auth/register", userData)
        return response.data
    } catch (error) {
        console.log("Register Error", error)
    }
}   