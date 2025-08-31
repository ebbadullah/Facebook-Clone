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

const initialState = {
    currentUser: null,
    suggestedUsers: [],
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
            });
    },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
