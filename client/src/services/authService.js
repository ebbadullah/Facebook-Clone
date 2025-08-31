import api from "./api"

const authService = {
    register: (userData) => {
        return api.post("/users/register", userData)
    },

    verifyOTP: (otpData) => {
        return api.post("/users/verify-otp", otpData)
    },

    login: (credentials) => {
        return api.post("/users/login", credentials)
    },

    logout: () => {
        return api.get("/users/logout")
    },

    checkAuthentication: () => {
        return api.get("/users/checkAuthentication")
    },
}

export default authService
