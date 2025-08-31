import mongoose from "mongoose";

let userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, },

        name: { type: String, required: true, },

        email: { type: String, required: true, unique: true, },

        password: { type: String, required: true, },

        emailVerificationToken: { type: String, required: false, },

        emailVerifyTokenExpires: { type: String, required: false, },

        IsVerify: { type: Boolean, default: false, },

        ProfilePicture: { type: String, default: "", },

        bio: { type: String, default: "", },

        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", },],

        stories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Story", },],

        bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", },],

        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", },],

        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", },],

        friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", },],

        sentFriendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", },],

        blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", },],

        blockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", },],

    },
    { timestamps: true }
);

let user = mongoose.model("User", userSchema);
export default user;
