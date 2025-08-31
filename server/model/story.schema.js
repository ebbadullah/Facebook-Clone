import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    media_url: { type: String, required: true },

    media_type: { type: String, enum: ["image", "video"], required: true },

    caption: { type: String, default: "" },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    views: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }
}, { timestamps: true });

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model("Story", storySchema);
export default Story;

