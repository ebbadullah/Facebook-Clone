import api from "./api"

const postService = {
    createPost: (postData) => {
        const formData = new FormData()
        formData.append("caption", postData.caption)
        
        // Handle multiple files
        if (Array.isArray(postData.media)) {
            // Append each file individually with the same field name
            postData.media.forEach((file, index) => {
                formData.append("media", file)
            })
        } else if (postData.media) {
            // For backward compatibility
            formData.append("media", postData.media)
        }

        return api.post("/posts/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    },

    getAllPosts: () => {
        return api.get("/posts")
    },

    likePost: (postId) => {
        return api.put(`/posts/${postId}/like`)
    },

    bookmarkPost: (postId) => {
        return api.put(`/posts/${postId}/bookmark`)
    },

    commentOnPost: (postId, comment) => {
        return api.post(`/posts/${postId}/comment`, { comment })
    },

    deletePost: (postId) => {
        return api.delete(`/posts/${postId}`)
    },

    updatePost: (postId, caption) => {
        return api.put(`/posts/${postId}`, { caption })
    },
}

export default postService
