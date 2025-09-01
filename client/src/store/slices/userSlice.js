import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

// Async thunks
export const getCurrentUser = createAsyncThunk(
    "users/getCurrent",
    async (_, { rejectWithValue }) => {
        try {
            const response = await userService.getCurrentUser();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getSuggestedUsers = createAsyncThunk(
    "users/getSuggested",
    async (_, { rejectWithValue }) => {
        try {
            const response = await userService.getSuggestedUsers();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const followUser = createAsyncThunk(
    "users/follow",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await userService.followUser(userId);
            return { userId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Friend request async thunks
export const sendFriendRequest = createAsyncThunk(
    "users/sendFriendRequest",
    async (receiverId, { rejectWithValue }) => {
        try {
            const response = await userService.sendFriendRequest(receiverId);
            return { receiverId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const acceptFriendRequest = createAsyncThunk(
    "users/acceptFriendRequest",
    async (senderId, { rejectWithValue }) => {
        try {
            const response = await userService.acceptFriendRequest(senderId);
            return { senderId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const rejectFriendRequest = createAsyncThunk(
    "users/rejectFriendRequest",
    async (senderId, { rejectWithValue }) => {
        try {
            const response = await userService.rejectFriendRequest(senderId);
            return { senderId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getFriendRequests = createAsyncThunk(
    "users/getFriendRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await userService.getFriendRequests();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Get user's friends
export const getUserFriends = createAsyncThunk(
    "users/getUserFriends",
    async (_, { rejectWithValue }) => {
        try {
            const response = await userService.getUserFriends();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    currentUser: null,
    suggestedUsers: [],
    friendRequests: [],
    friends: [],
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Current User
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentUser = action.payload.finalUser;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message;
            })

            // Get Suggested Users
            .addCase(getSuggestedUsers.fulfilled, (state, action) => {
                state.suggestedUsers = action.payload.suggestedUser;
            })

            // Follow User
            .addCase(followUser.fulfilled, (state, action) => {
                // Update suggested users list
                state.suggestedUsers = state.suggestedUsers.filter(
                    (user) => user._id !== action.payload.userId
                );
            })

            // Send Friend Request
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                // Update suggested users list to remove the user we sent request to
                state.suggestedUsers = state.suggestedUsers.filter(
                    (user) => user._id !== action.payload.receiverId
                );
            })

            // Accept Friend Request
            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                // Remove from friend requests
                state.friendRequests = state.friendRequests.filter(
                    (request) => request._id !== action.payload.senderId
                );
                
                // The friends list will be refreshed by calling getUserFriends again
                // This ensures we get the most up-to-date data from the server
            })

            // Reject Friend Request
            .addCase(rejectFriendRequest.fulfilled, (state, action) => {
                // Remove from friend requests
                state.friendRequests = state.friendRequests.filter(
                    (request) => request._id !== action.payload.senderId
                );
            })

            // Get Friend Requests
            .addCase(getFriendRequests.fulfilled, (state, action) => {
                state.friendRequests = action.payload.data;
            })

            // Get User Friends
            .addCase(getUserFriends.fulfilled, (state, action) => {
                state.friends = action.payload.data;
            });
    },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
