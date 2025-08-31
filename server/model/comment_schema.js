import mongoose from "mongoose";

let commentSchema = new mongoose.Schema(
    {
        comment: { type: String, required: true },

        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },

        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    },
    { timestamps: true }
);

let Comment = mongoose.model("Comment", commentSchema);

export default Comment;
