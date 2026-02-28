import axios from "axios";

const api = axios.create({
    // Vercel rewrites /api/* to the Render backend, keeping cookies on the same domain
    baseURL: "/api/v1",  
    withCredentials: true // CRITICAL: This allows the browser to send/receive Cookies
});

api.interceptors.request.use(
    (config) => {
        // 1. Log to console to verify the fix is running
        if (config.data instanceof FormData) {
            console.log("📂 File Upload Detected: Removing Content-Type header to allow browser automation.");
            // 2. DELETE the header so browser sets 'multipart/form-data; boundary=...'
            delete config.headers["Content-Type"];
        } else {
            // 3. Otherwise, use JSON
            config.headers["Content-Type"] = "application/json";
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;