import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            // FIX IS HERE:
            // Ensure we assign payload DIRECTLY to state.user
            // Do NOT use action.payload.user (that causes the empty box error)
            state.user = action.payload; 
        },
        logout: (state) => {
            state.status = false;
            state.user = null;
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;