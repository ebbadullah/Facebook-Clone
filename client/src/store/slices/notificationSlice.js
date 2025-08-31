import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

// Async thunks
export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (notificationId, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/notifications/${notificationId}/read`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to mark notification as read");
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk(
    "notifications/markAllAsRead",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.patch("/notifications/mark-all-read");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to mark all notifications as read");
        }
    }
);

export const getUnreadNotificationCount = createAsyncThunk(
    "notifications/getUnreadCount",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/notifications/unread-count");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to get unread count");
        }
    }
);

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalNotifications: 0,
        hasNext: false,
    },
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        clearNotifications: (state) => {
            state.notifications = [];
            state.error = null;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        updateUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.pagination.currentPage === 1) {
                    state.notifications = action.payload.data;
                } else {
                    state.notifications = [...state.notifications, ...action.payload.data];
                }
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Mark notification as read
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notificationId = action.payload.data._id;
                const notification = state.notifications.find(n => n._id === notificationId);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            // Mark all notifications as read
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications.forEach(notification => {
                    notification.isRead = true;
                });
                state.unreadCount = 0;
            })
            // Get unread count
            .addCase(getUnreadNotificationCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload.data.unreadCount;
            });
    },
});

export const { clearNotifications, addNotification, updateUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;


