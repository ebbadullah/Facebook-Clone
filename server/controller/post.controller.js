import post from "../model/post.schema.js"
import user from "../model/user.schema.js"
import comment from "../model/comment_schema.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import getFileUri from "../utils/fileURI.js"

let postCreate = async (req, res) => {
    try {
        let userId = req.userId
        let { caption } = req.body
        let file = req.file
        if (!file || !caption) return res.status(400).json({ status: false, message: "Media file and caption are required" })
        if (!userId) return res.status(401).json({ status: false, message: "Unauthorized - Please login first" })
        
        let findUser = await user.findById(userId)
        if (!findUser) return res.status(404).json({ status: false, message: "User not found" })
        
        let cloudResponse
        if (file.mimetype.startsWith("video")) cloudResponse = await uploadToCloudinary(file.path, "post/video")
        else cloudResponse = await uploadToCloudinary(file.path, "post/image")
        
        let newPost = await post.create({ media_url: cloudResponse.secure_url, caption, media_type: file.mimetype.split("/")[0], author: userId, cloudinary_id: cloudResponse.public_id })
        await user.findByIdAndUpdate(userId, { $push: { posts: newPost._id } })
        
        const populatedPost = await post.findById(newPost._id).populate("author", "name username ProfilePicture")
        res.status(201).json({ status: true, message: "Post created successfully", data: populatedPost })
    } catch (error) {
        console.error("Post creation error:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let likeDislike = async (req, res) => {
    try {
        let userId = req.userId
        let postId = req.params.id
        if (!userId || !postId) return res.status(400).json({ status: false, message: "user id or post id is required" })
        
        let [author, post_Id] = await Promise.all([user.findById(userId), post.findById(postId)])
        if (!author || !post_Id) return res.status(404).json({ status: false, message: "user or post not found" })
        
        let isLike = await post_Id.likes.includes(userId)
        if (isLike) {
            await post.updateOne({ $pull: { likes: userId } })
            await author.save()
            return res.status(200).json({ status: true, message: "post disliked" })
        } else {
            await post.updateOne({ $push: { likes: userId } })
            await author.save()
            
            if (post_Id.author.toString() !== userId) {
                const { createNotification } = await import("./notification.controller.js")
                await createNotification(post_Id.author, userId, "like", { post: postId })
            }
            
            return res.status(200).json({ status: true, message: "post liked" })
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "internal sever error", error: error.message })
    }
}

let getAllPosts = async (req, res) => {
    try {
        let userId = req.userId
        if (!userId) return res.status(400).json({ status: false, message: "User ID is required" })
        
        let allPosts = await post.find().populate("author", "name username ProfilePicture").populate("likes", "name username ProfilePicture").populate("comments", "comment author").sort({ createdAt: -1 })
        res.status(200).json({ status: true, message: "Posts fetched successfully", posts: allPosts })
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let bookmarkPost = async (req, res) => {
    try {
        let userId = req.userId
        let postId = req.params.id
        if (!userId || !postId) return res.status(400).json({ status: false, message: "User ID and Post ID are required" })
        
        let [findUser, findPost] = await Promise.all([user.findById(userId), post.findById(postId)])
        if (!findUser || !findPost) return res.status(404).json({ status: false, message: "User or Post not found" })
        
        let isBookmarked = findUser.bookmarks.includes(postId)
        if (isBookmarked) {
            await user.updateOne({ _id: userId }, { $pull: { bookmarks: postId } })
            return res.status(200).json({ status: true, message: "Post removed from bookmarks" })
        } else {
            await user.updateOne({ _id: userId }, { $push: { bookmarks: postId } })
            return res.status(200).json({ status: true, message: "Post added to bookmarks" })
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let postComment = async (req, res) => {
    try {
        let userId = req.userId
        let postId = req.params.id
        let { comment: commentText } = req.body
        if (!userId || !postId || !commentText) return res.status(400).json({ status: false, message: "User ID, Post ID, and Comment are required" })
        
        let [findUser, findPost] = await Promise.all([user.findById(userId), post.findById(postId)])
        if (!findUser || !findPost) return res.status(404).json({ status: false, message: "User or Post not found" })
        
        let newComment = new comment({ comment: commentText, post: postId, author: userId })
        await newComment.save()
        await post.updateOne({ _id: postId }, { $push: { comments: newComment._id } })
        
        if (findPost.author.toString() !== userId) {
            const { createNotification } = await import("./notification.controller.js")
            await createNotification(findPost.author, userId, "comment", { post: postId, comment: newComment._id })
        }
        
        const populatedComment = await comment.findById(newComment._id).populate("author", "name username ProfilePicture")
        res.status(201).json({ status: true, message: "Comment added successfully", comment: populatedComment })
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let deletePost = async (req, res) => {
    try {
        let userId = req.userId
        let postId = req.params.id
        if (!userId || !postId) return res.status(400).json({ status: false, message: "User ID and Post ID are required" })
        
        let findPost = await post.findById(postId)
        if (!findPost) return res.status(404).json({ status: false, message: "Post not found" })
        
        if (findPost.author.toString() !== userId) return res.status(403).json({ status: false, message: "You can only delete your own posts" })
        
        await user.updateOne({ _id: userId }, { $pull: { posts: postId } })
        await post.deleteOne({ _id: postId })
        res.status(200).json({ status: true, message: "Post deleted successfully" })
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let updatePost = async (req, res) => {
    try {
        let userId = req.userId
        let postId = req.params.id
        let { caption } = req.body
        if (!userId || !postId || !caption) return res.status(400).json({ status: false, message: "User ID, Post ID, and Caption are required" })
        
        let findPost = await post.findById(postId)
        if (!findPost) return res.status(404).json({ status: false, message: "Post not found" })
        
        if (findPost.author.toString() !== userId) return res.status(403).json({ status: false, message: "You can only update your own posts" })
        
        let updatedPost = await post.findByIdAndUpdate(postId, { caption }, { new: true })
        res.status(200).json({ status: true, message: "Post updated successfully", post: updatedPost })
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let sharePost = async (req, res) => {
    try {
        let userId = req.userId
        let postId = req.params.id
        let { caption } = req.body
        if (!userId || !postId) return res.status(400).json({ status: false, message: "User ID and Post ID are required" })
        
        let [findUser, originalPost] = await Promise.all([user.findById(userId), post.findById(postId).populate("author", "name username ProfilePicture")])
        if (!findUser || !originalPost) return res.status(404).json({ status: false, message: "User or Post not found" })
        
        let sharedPost = await post.create({ media_url: originalPost.media_url, caption: caption || `Shared: ${originalPost.caption}`, media_type: originalPost.media_type, author: userId, originalPost: postId, isShared: true })
        await user.findByIdAndUpdate(userId, { $push: { posts: sharedPost._id } })
        await post.findByIdAndUpdate(postId, { $push: { shares: userId } })
        
        if (originalPost.author._id.toString() !== userId) {
            const { createNotification } = await import("./notification.controller.js")
            await createNotification(originalPost.author._id, userId, "share", { post: postId })
        }
        
        const populatedSharedPost = await post.findById(sharedPost._id).populate("author", "name username ProfilePicture").populate("originalPost", "caption media_url author")
        res.status(201).json({ status: true, message: "Post shared successfully", data: populatedSharedPost })
    } catch (error) {
        console.error("Error sharing post:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let getPostLikes = async (req, res) => {
    try {
        let postId = req.params.id
        if (!postId) return res.status(400).json({ status: false, message: "Post ID is required" })
        
        let findPost = await post.findById(postId).populate("likes", "name username ProfilePicture").select("likes")
        if (!findPost) return res.status(404).json({ status: false, message: "Post not found" })
        
        res.status(200).json({ status: true, data: findPost.likes })
    } catch (error) {
        console.error("Error getting post likes:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let getUserPosts = async (req, res) => {
    try {
        let { userId } = req.params
        let { type = "all" } = req.query
        if (!userId) return res.status(400).json({ status: false, message: "User ID is required" })
        
        let findUser = await user.findById(userId)
        if (!findUser) return res.status(404).json({ status: false, message: "User not found" })
        
        let query = { author: userId }
        switch (type) {
            case "photos": query.media_type = "image"; break
            case "videos": query.media_type = "video"; break
            case "shared": query.isShared = true; break
            default: break
        }
        
        let posts = await post.find(query).populate("author", "name username ProfilePicture").populate("originalPost", "caption media_url author").populate("likes", "name username ProfilePicture").populate("comments", "content author").sort({ createdAt: -1 })
        res.status(200).json({ status: true, data: posts })
    } catch (error) {
        console.error("Error getting user posts:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

export { postCreate, likeDislike, getAllPosts, bookmarkPost, postComment, deletePost, updatePost, sharePost, getPostLikes, getUserPosts }