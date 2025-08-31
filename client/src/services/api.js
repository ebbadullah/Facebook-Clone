import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Only redirect to login if it's a clear authentication error
        // and we're not already on the login page
        if (error.response?.status === 401 &&
            !window.location.pathname.includes('/login') &&
            !window.location.pathname.includes('/register')) {
            // Don't clear localStorage, let Redux persist handle it
            window.location.href = "/login"
        }
        return Promise.reject(error)
    },
)

export default api
