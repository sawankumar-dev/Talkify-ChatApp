import apiClient from "@/config/apiClient";
import type { LoginUserInput, RegisterUserInput } from "../types/auth.types";

export const registerUserApi = async (userData: RegisterUserInput) => {
    try {
        const response = await apiClient.post("/auth/register", userData)
        return response.data
    } catch (error) {
        console.log("Register Error", error)
    }
}   

export const loginUserApi = async (credential: LoginUserInput) => {
    try {
        const response = await apiClient.post("/auth/login", credential);
        return response.data
    } catch (error) {
        console.log("Login Error", error)
    }
}

export const getMe = async () => {
    try {
        const response = await apiClient.get("/auth/me")
        return response.data
    } catch (error) {
        console.log("Profile Fetched ", error)
    }
}