import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const createStory = createAsyncThunk(
    "stories/createStory",
    async (storyData, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("media", storyData.file);
            if (storyData.caption) {
                formData.append("caption", storyData.caption);
            }

            const response = await api.post("/stories", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create story");
        }
    }
);

export const fetchStories = createAsyncThunk(
    "stories/fetchStories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/stories");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch stories");
        }
    }
);

export const fetchUserStories = createAsyncThunk(
    "stories/fetchUserStories",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/stories/user/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch user stories");
        }
    }
);

export const toggleStoryLike = createAsyncThunk(
    "stories/toggleLike",
    async (storyId, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/stories/${storyId}/like`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to toggle story like");
        }
    }
);

export const viewStory = createAsyncThunk(
    "stories/viewStory",
    async (storyId, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/stories/${storyId}/view`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to view story");
        }
    }
);

export const deleteStory = createAsyncThunk(
    "stories/deleteStory",
    async (storyId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/stories/${storyId}`);
            return { storyId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete story");
        }
    }
);

const initialState = {
    stories: [],
    userStories: [],
    loading: false,
    error: null,
};

const storySlice = createSlice({
    name: "stories",
    initialState,
    reducers: {
        clearStories: (state) => {
            state.stories = [];
            state.error = null;
        },
        clearUserStories: (state) => {
            state.userStories = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Create story
            .addCase(createStory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStory.fulfilled, (state, action) => {
                state.loading = false;
                // Add to stories array
                state.stories.unshift(action.payload.data);
                // Add to userStories array
                state.userStories.unshift(action.payload.data);
                // Force re-render by updating the array reference
                state.stories = [...state.stories];
                state.userStories = [...state.userStories];
            })
            .addCase(createStory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch stories
            .addCase(fetchStories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStories.fulfilled, (state, action) => {
                state.loading = false;
                state.stories = action.payload.data;
            })
            .addCase(fetchStories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch user stories
            .addCase(fetchUserStories.fulfilled, (state, action) => {
                state.userStories = action.payload.data;
            })
            // Toggle story like
            .addCase(toggleStoryLike.fulfilled, (state, action) => {
                const updatedStory = action.payload.data;
                const storyIndex = state.stories.findIndex(s => s._id === updatedStory._id);
                if (storyIndex !== -1) {
                    state.stories[storyIndex] = updatedStory;
                }

                const userStoryIndex = state.userStories.findIndex(s => s._id === updatedStory._id);
                if (userStoryIndex !== -1) {
                    state.userStories[userStoryIndex] = updatedStory;
                }
            })
            // Delete story
            .addCase(deleteStory.fulfilled, (state, action) => {
                const storyId = action.payload.storyId;
                state.stories = state.stories.filter(s => s._id !== storyId);
                state.userStories = state.userStories.filter(s => s._id !== storyId);
            });
    },
});

export const { clearStories, clearUserStories } = storySlice.actions;
export default storySlice.reducer;


