import api from "./api"

const postService = {
    createPost: (postData) => {
        const formData = new FormData()
        formData.append("caption", postData.caption)
        
        if (Array.isArray(postData.media)) {
            postData.media.forEach((file, index) => {
                formData.append("media", file)
            })
        } else if (postData.media) {
            formData.append("media", postData.media)
        }

        return api.post("/posts/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,

            },
        })
    },

    getAllPosts: () => {
        return api.get("/posts")
    },

    likePost: (postId) => {
        return api.put(`/posts/${postId}/like`)
    },

    setReaction: (postId, type) => {
        return api.put(`/posts/${postId}/reaction`, { type })
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
