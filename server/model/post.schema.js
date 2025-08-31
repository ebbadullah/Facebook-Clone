import mongoose from "mongoose";

let postSchema = new mongoose.Schema(
    {
        caption: { type: String, required: true },

        media_url: { type: String, required: true },

        media_type: { type: String, enum: ["image", "video"], required: true },

        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        originalPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },

        isShared: { type: Boolean, default: false }
    },
    { timestamps: true }
);

let Post = mongoose.model("Post", postSchema);

export default Post;
