import Story from "../model/story.schema.js";
import User from "../model/user.schema.js";
import { createNotification } from "./notification.controller.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const createStory = async (req, res) => {
    try {
        const { caption } = req.body;
        const userId = req.userId;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ status: false, message: "Please upload a file" });
        }

        const result = await uploadToCloudinary(file.path, "stories");
        if (!result) {
            return res.status(500).json({ status: false, message: "Error uploading file" });
        }

        const mediaType = file.mimetype.startsWith("video/") ? "video" : "image";

        const story = new Story({
            author: userId,
            media_url: result.secure_url,
            media_type: mediaType,
            caption: caption || "",
        });

        await story.save();

        await User.findByIdAndUpdate(userId, { $push: { stories: story._id } });

        const populatedStory = await Story.findById(story._id).populate("author", "name username ProfilePicture");

        res.status(201).json({ status: true, data: populatedStory, message: "Story created successfully" });
    } catch (error) {
        console.error("Error creating story:", error);
        res.status(500).json({ status: false, message: "Error creating story", error: error.message });
    }
};

export const getStories = async (req, res) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.status(400).json({
                status: false,
                message: "please continue to login",
            });
        }

        // get user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        // Get following IDs safely
        let followingIds = [];
        
        // Only try to populate following if it exists
        if (user.following && user.following.length > 0) {
            const populatedUser = await User.findById(userId).populate("following");
            if (populatedUser && populatedUser.following) {
                followingIds = populatedUser.following.map(friend => friend._id);
            }
        }
        
        // Always include current user's stories
        followingIds.push(userId);

        const stories = await Story.find({
            author: { $in: followingIds },
            expiresAt: { $gt: new Date() },
        })
            .populate("author", "name username ProfilePicture")
            .populate("likes", "name username ProfilePicture")
            .populate("views", "name username ProfilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json({ status: true, data: stories });
    } catch (error) {
        console.error("Error getting stories:", error);
        res.status(500).json({
            status: false,
            message: "Error fetching stories",
            error: error.message,
        });
    }
};


export const getUserStories = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.userId;

        const stories = await Story.find({
            author: userId,
            expiresAt: { $gt: new Date() },
        })
            .populate("author", "name username ProfilePicture")
            .populate("likes", "name username ProfilePicture")
            .populate("views", "name username ProfilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json({ status: true, data: stories });
    } catch (error) {
        console.error("Error getting user stories:", error);
        res.status(500).json({ status: false, message: "Error fetching user stories", error: error.message });
    }
};

export const toggleStoryLike = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.userId;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ status: false, message: "Story not found" });
        }

        const isLiked = story.likes.includes(userId);

        if (isLiked) {
            story.likes = story.likes.filter(id => id.toString() !== userId);
            await story.save();
        } else {
            story.likes.push(userId);
            await story.save();

            if (story.author.toString() !== userId) {
                await createNotification(story.author, userId, "story_like", { story: storyId });
            }
        }

        const updatedStory = await Story.findById(storyId)
            .populate("author", "name username ProfilePicture")
            .populate("likes", "name username ProfilePicture");

        res.status(200).json({ status: true, data: updatedStory, message: isLiked ? "Story unliked" : "Story liked" });
    } catch (error) {
        console.error("Error toggling story like:", error);
        res.status(500).json({ status: false, message: "Error updating story like", error: error.message });
    }
};

export const viewStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.userId;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ status: false, message: "Story not found" });
        }

        // Add view if not already viewed
        if (!story.views.includes(userId)) {
            story.views.push(userId);
            await story.save();
        }

        res.status(200).json({ status: true, message: "Story viewed" });
    } catch (error) {
        console.error("Error viewing story:", error);
        res.status(500).json({ status: false, message: "Error viewing story", error: error.message });
    }
};

export const deleteStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.userId;

        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ status: false, message: "Story not found" });
        }

        if (story.author.toString() !== userId) {
            return res.status(403).json({ status: false, message: "You can only delete your own stories" });
        }

        await Story.findByIdAndDelete(storyId);

        // Remove from user's stories
        await User.findByIdAndUpdate(userId, { $pull: { stories: storyId } });

        res.status(200).json({ status: true, message: "Story deleted successfully" });
    } catch (error) {
        console.error("Error deleting story:", error);
        res.status(500).json({ status: false, message: "Error deleting story", error: error.message });
    }
};