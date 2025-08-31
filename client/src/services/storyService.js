import api from "./api";

export const storyService = {
    createStory: async (storyData) => {
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
    },

    getStories: async () => {
        const response = await api.get("/stories");
        return response.data;
    },

    getUserStories: async (userId) => {
        const response = await api.get(`/stories/user/${userId}`);
        return response.data;
    },

    toggleLike: async (storyId) => {
        const response = await api.patch(`/stories/${storyId}/like`);
        return response.data;
    },

    viewStory: async (storyId) => {
        const response = await api.patch(`/stories/${storyId}/view`);
        return response.data;
    },

    deleteStory: async (storyId) => {
        const response = await api.delete(`/stories/${storyId}`);
        return response.data;
    },
};


