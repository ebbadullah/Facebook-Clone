import api from "./api";

export const notificationService = {
    getNotifications: async (page = 1, limit = 20) => {
        const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
        return response.data;
    },

    markAsRead: async (notificationId) => {
        const response = await api.patch(`/notifications/${notificationId}/read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.patch("/notifications/mark-all-read");
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await api.get("/notifications/unread-count");
        return response.data;
    },
};


