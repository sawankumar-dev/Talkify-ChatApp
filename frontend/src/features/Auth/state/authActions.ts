import { createAsyncThunk } from "@reduxjs/toolkit";
import { registerUserApi } from "../api/auth.api";
import type { RegisterUserInput } from "../types/auth.types";

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