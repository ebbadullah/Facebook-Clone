import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "../../services/postService";

export const createPost = createAsyncThunk("posts/create", async (postData, { rejectWithValue }) => {
    try {
        const response = await postService.createPost(postData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getAllPosts = createAsyncThunk("posts/getAll", async (_, { rejectWithValue }) => {
    try {
        const response = await postService.getAllPosts();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const likePost = createAsyncThunk("posts/like", async (postId, { rejectWithValue, getState }) => {
    try {
        const response = await postService.likePost(postId);
        const { user } = getState().auth;
        
        return { 
            postId, 
            userId: user?._id, 
            user, 
            data: response.data.data,
            isLiked: response.data.data.isLiked
        };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const bookmarkPost = createAsyncThunk("posts/bookmark", async (postId, { rejectWithValue }) => {
    try {
        const response = await postService.bookmarkPost(postId);
        return { postId, ...response.data };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const commentOnPost = createAsyncThunk("posts/comment", async ({ postId, comment }, { rejectWithValue, getState }) => {
    try {
        const response = await postService.commentOnPost(postId, comment);
        const { user } = getState().auth;
        return {
            postId,
            comment: {
                ...response.data.comment,
                author: user
            }
        };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deletePost = createAsyncThunk("posts/delete", async (postId, { rejectWithValue }) => {
    try {
        const response = await postService.deletePost(postId);
        return { postId, ...response.data };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updatePost = createAsyncThunk("posts/update", async ({ postId, caption }, { rejectWithValue }) => {
    try {
        const response = await postService.updatePost(postId, caption);
        return { postId, caption, ...response.data };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

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
        updatePostLikes: (state, action) => {
            const { postId, likes, isLiked } = action.payload;
            const post = state.posts.find((p) => p._id === postId);
            if (post) {
                post.likes = likes;
                post.isLiked = isLiked;
            }
        },
    },
    extraReducers: (builder) => {
        builder
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
            .addCase(likePost.fulfilled, (state, action) => {
                const { postId, data } = action.payload;
                const post = state.posts.find((p) => p._id === postId);
                
                if (post && data) {
                    post.likes = data.likes;
                    post.isLiked = data.isLiked;
                    post.likes = [...post.likes];
                }
            })
            .addCase(likePost.rejected, (state, action) => {
                state.error = action.payload.message;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                const postId = action.payload.postId;
                state.posts = state.posts.filter((p) => p._id !== postId);
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.error = action.payload.message;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                const post = state.posts.find((p) => p._id === action.payload.postId);
                if (post) {
                    post.caption = action.payload.caption;
                }
            })
            .addCase(updatePost.rejected, (state, action) => {
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

export const { clearError, updatePostLikes } = postSlice.actions;
export default postSlice.reducer;