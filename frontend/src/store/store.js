import { configureStore } from "@reduxjs/toolkit"

import authReducer from '../features/authSlice.js'

// configureStore creates the Redux store
export const store = configureStore({
    reducer: {
        // We tell the store: "The 'auth' part of state is managed by authReducer"
        // When you use useSelector((state) => state.auth), it looks here.
        "auth": authReducer

        // Later, we will add:
        // chat: chatReducer
    }
})