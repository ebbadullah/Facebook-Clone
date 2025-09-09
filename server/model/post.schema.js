import mongoose from "mongoose";

let postSchema = new mongoose.Schema(
    {
        caption: { type: String, required: true },

        media_url: { type: [String], required: true },

        media_type: { type: [String], enum: ["image", "video"], required: true },
        
        cloudinary_id: { type: [String], required: true },

        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        originalPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },

        isShared: { type: Boolean, default: false },

        // Reactions keep compatibility with existing likes
        // type enum can be extended later if needed
        reactions: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                type: { type: String, enum: ["like", "love", "care", "haha", "wow", "sad", "angry"] }
            }
        ]
    },
    { timestamps: true }
);

let Post = mongoose.model("Post", postSchema);

export default Post;
