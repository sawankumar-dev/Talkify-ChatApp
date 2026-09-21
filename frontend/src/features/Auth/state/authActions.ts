import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMe, loginUserApi, refreshTokenApi, registerUserApi } from "../api/auth.api";
import type { LoginUserInput, RegisterUserInput } from "../types/auth.types";

export const registerUserAction = createAsyncThunk(
    "auth/register",
    async (userData: RegisterUserInput, thunkAPI) => {
        try {
            const response = await registerUserApi(userData)
            return response?.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data.message || "Error in register user Action")
        }
    }
)

export const loginUserAction = createAsyncThunk(
    "auth/login",
    async (credential: LoginUserInput, thunkAPI) => {
        try {
            const response = await loginUserApi(credential);
            return response?.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data.message || "Error in login user Action")
        }
    }
)

export const getMeAction = createAsyncThunk(
    "auth/me",
    async (_, thunkAPI) => {
        try {
            const response = await getMe()
            return response?.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data.message || "Error in Profile fetching")
        }
    }
)