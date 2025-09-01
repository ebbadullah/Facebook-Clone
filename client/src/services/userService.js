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

    // Friend request methods
    sendFriendRequest: (receiverId) => {
        return api.post(`/users/friend-request/${receiverId}`)
    },

    acceptFriendRequest: (senderId) => {
        return api.post(`/users/friend-request/${senderId}/accept`)
    },

    rejectFriendRequest: (senderId) => {
        return api.post(`/users/friend-request/${senderId}/reject`)
    },

    getFriendRequests: () => {
        return api.get("/users/friend-requests")
    },

    // Get user's friends
    getUserFriends: () => {
        return api.get("/users/friends")
    },
}

export default userService
