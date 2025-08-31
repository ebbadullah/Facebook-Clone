import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        type: { type: String, enum: ["like", "comment", "friend_request", "friend_accept", "story_like", "share"], required: true },

        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },

        story: { type: mongoose.Schema.Types.ObjectId, ref: "Story" },

        comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },

        isRead: { type: Boolean, default: false },

        message: { type: String, required: true }
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

