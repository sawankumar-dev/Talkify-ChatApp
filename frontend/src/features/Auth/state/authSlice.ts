import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../types/auth.types";
import { getMeAction, loginUserAction,registerUserAction } from "./authActions";

interface AuthState {
    user: User | null,
    isLoading: boolean,
    isAuthenticated: boolean,
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: { 
        
    },
    extraReducers(builder) {
        builder
        // ============ REGISTER ==============
        .addCase(registerUserAction.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(registerUserAction.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        })
        .addCase(registerUserAction.rejected, (state) => {
            state.isLoading = false;
        })
        
        // ============ LOGIN ==============
        .addCase(loginUserAction.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(loginUserAction.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        })
        .addCase(loginUserAction.rejected, (state) => {
            state.isLoading = false;
        })

        // ============ PROFILE ME ==============
        .addCase(getMeAction.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getMeAction.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        })
        .addCase(getMeAction.rejected, (state) => {
            state.isLoading = false;
        })

    },
})
export default authSlice