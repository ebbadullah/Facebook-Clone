import api from "./api"

const userService = {
    getCurrentUser: () => {
        return api.get("/users/getUser")
    },

    getSuggestedUsers: () => {
        return api.get("/users/suggestedUser")
    },

    getUserById: (userId) => {
        return api.get(`/users/getUserById/${userId}`)
    },

    followUser: (userId) => {
        return api.put(`/users/followAndUnfollow/${userId}`)
    },
}

export default userService
