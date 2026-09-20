import { createSlice } from "@reduxjs/toolkit";

interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar: string | null;
    createdAt: string;
}

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
        
    }

})
export default authSlice