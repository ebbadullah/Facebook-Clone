import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "../../services/postService";

export const createPost = createAsyncThunk(
    "posts/create",
    async (postData, { rejectWithValue }) => {
        try {
            const response = await postService.createPost(postData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getAllPosts = createAsyncThunk(
    "posts/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await postService.getAllPosts();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const likePost = createAsyncThunk(
    "posts/like",
    async (postId, { rejectWithValue, getState }) => {
        try {
            const response = await postService.likePost(postId);
            const { user } = getState().auth;
            return { postId, userId: user?._id, user, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const bookmarkPost = createAsyncThunk(
    "posts/bookmark",
    async (postId, { rejectWithValue }) => {
        try {
            const response = await postService.bookmarkPost(postId);
            return { postId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const commentOnPost = createAsyncThunk(
    "posts/comment",
    async ({ postId, comment }, { rejectWithValue, getState }) => {
        try {
            const response = await postService.commentOnPost(postId, comment);
            const { user } = getState().auth;
            return {
                postId,
                comment: {
                    ...response.data.comment,
                    author: user // Add author info to the comment
                }
            };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    posts: [],
    isLoading: false,
    error: null,
    createPostLoading: false,
};

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Post
            .addCase(createPost.pending, (state) => {
                state.createPostLoading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.createPostLoading = false;
                state.posts.unshift(action.payload.data);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.createPostLoading = false;
                state.error = action.payload.message;
            })

            // Get All Posts
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload.posts;
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message;
            })

            // Like Post
            .addCase(likePost.fulfilled, (state, action) => {
                const post = state.posts.find((p) => p._id === action.payload.postId);
                if (post) {
                    const userId = action.payload.userId;
                    const userIndex = post.likes.findIndex(like =>
                        typeof like === 'string' ? like === userId : like._id === userId
                    );

                    if (userIndex !== -1) {
                        post.likes.splice(userIndex, 1);
                    } else {
                        const { user } = action.payload;
                        if (user) {
                            post.likes.push({
                                _id: user._id,
                                name: user.name,
                                username: user.username,
                                ProfilePicture: user.ProfilePicture
                            });
                        }
                    }

                    post.likes = [...post.likes];
                }
            })
            .addCase(likePost.rejected, (state, action) => {
                state.error = action.payload.message;
            })

            .addCase(commentOnPost.fulfilled, (state, action) => {
                const post = state.posts.find((p) => p._id === action.payload.postId);
                if (post) {
                    if (!post.comments) {
                        post.comments = [];
                    }
                    post.comments.unshift(action.payload.comment);
                }
            })
            .addCase(commentOnPost.rejected, (state, action) => {
                state.error = action.payload.message;
            });
    },
});

export const { clearError } = postSlice.actions;
export default postSlice.reducer;
