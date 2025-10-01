import { validationResult } from "express-validator"
import user from "../model/user.schema.js"
import bcrypt from "bcryptjs"
import generateToken from "../utils/generateToken.js"
import { sendOTP, sendWelcomeEmail } from "../email/sendemail.js";


let register = async (req, res) => {
    let { username, name, email, password } = req.body
    try {
        let error = validationResult(req)
        if (!error.isEmpty()) return res.status(400).json({ status: false, message: error.array() })
        
        let existingUser = await user.findOne({ email })
        if (existingUser) return res.status(400).json({ status: false, message: "User already exists" })
        
        let hashedpassword = await bcrypt.hash(password, 12)
        
        // Skip OTP verification and directly set user as verified
        let newUser = new user({ username, name, email, password: hashedpassword, IsVerify: true })
        let createdUser = await newUser.save()
        
        // Send welcome email directly
        await sendWelcomeEmail(email, username)
        
        // Generate token for automatic login
        generateToken(res, createdUser._id)
        
        res.status(201).json({ 
            status: true, 
            message: `Welcome ${username}! Your account has been created successfully.`, 
            user: { 
                _id: createdUser._id, 
                username: createdUser.username, 
                email: createdUser.email, 
                name: createdUser.name 
            } 
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: false, message: "Internal server error" })
    }
}

let verifyOTP = async (req, res) => {
    let { userId, otp } = req.body
    try {
        let userToVerify = await user.findById(userId)
        if (!userToVerify) return res.status(404).json({ status: false, message: "User not found" })
        if (userToVerify.emailVerificationToken !== otp) return res.status(400).json({ status: false, message: "Invalid OTP" })
        if (userToVerify.emailVerifyTokenExpires < new Date()) return res.status(400).json({ status: false, message: "OTP has expired" })
        
        userToVerify.IsVerify = true
        userToVerify.emailVerificationToken = undefined
        userToVerify.emailVerifyTokenExpires = undefined
        await userToVerify.save()
        
        await sendWelcomeEmail(userToVerify.email, userToVerify.username)
        generateToken(res, userToVerify._id)
        
        res.status(200).json({ status: true, message: `Welcome ${userToVerify.username}`, user: { _id: userToVerify._id, username: userToVerify.username, email: userToVerify.email, name: userToVerify.name } })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: false, message: "Internal server error" })
    }
}

let login = async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) return res.status(400).json({ status: false, message: "required fields are missing" })
        
        let findUser = await user.findOne({ email })
        if (!findUser) return res.status(400).json({ status: false, message: "user not found" })
        
        let checkPassword = await bcrypt.compare(password, findUser.password)
        if (!checkPassword) return res.status(400).json({ status: false, message: "invalid credentials" })
        
        generateToken(res, findUser._id)
        
        res.status(200).json({ status: true, message: `welcome ${findUser.username}`, findUser: { ...findUser._doc, password: "**********" } })
    } catch (error) {
        res.status(500).json({ status: false, message: "internal server error" })
    }
}

let logout = (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({ status: true, message: "logout successfully" })
    } catch (error) {
        res.status(500).json({ status: false, message: "internal server error" })
    }
}

let checkAuthentication = async (req, res) => {
    let userId = req.userId
    if (!userId) return res.status(400).json({ status: false, message: "please continue to login" })
    
    let findUser = await user.findById(userId)
    if (!findUser) return res.status(400).json({ status: false, message: "user not found" })
    
    return res.status(200).json({ status: true, message: "thanks for verification" })
}

let getUser = async (req, res) => {
    try {
        let userId = req.userId
        if (!userId) return res.status(404).json({ status: false, message: "userId is required" })
        
        let findUser = await user.findById(userId).select("-password")
        if (!findUser) return res.status(404).json({ status: false, message: "user not found" })
        
        res.status(200).json({ status: true, message: "user found successfully", finalUser: findUser })
    } catch (error) {
        res.status(500).json({ status: false, message: "internal server error" })
    }
}

let suggestedUser = async (req, res) => {
    try {
        let userId = req.userId
        if (!userId) return res.status(400).json({ status: false, message: "userId is required" })
        
        let findUser = await user.find({ _id: { $ne: userId } }).select("-password").limit(5).lean()
        if (findUser.length > 0) res.status(200).json({ status: true, message: "find suggested user successfully", suggestedUser: findUser })
        else res.status(400).json({ status: false, message: "user not found" })
    } catch (error) {
        res.status(500).json({ status: false, message: "internal server error", error })
    }
}

let getUserById = async (req, res) => {
    try {
        let { userId } = req.params
        if (!userId) return res.status(400).json({ status: false, message: "userId is required" })
        
        let fineUser = await user.findById(userId).select("-password")
        if (!fineUser) return res.status(404).json({ status: false, message: "user not found" })
        
        res.status(200).json({ status: true, message: "find user successfully", user: fineUser })
    } catch (error) {
        res.status(500).json({ status: false, message: "internal server error", error })
    }
}

let followAndUnfollow = async (req, res) => {
    try {
        let userMe = req.userId
        let userYou = req.params.id
        if (!userMe || !userYou) return res.status(404).json({ status: false, message: "userId is required" })
        
        let [me, you] = await Promise.all([user.findById(userMe), user.findById(userYou)])
        if (!me || !you) return res.status(404).json({ status: false, message: "user not found" })
        
        let isFollowing = me.following.includes(userYou)
        await Promise.all([
            user.updateOne({ _id: userMe }, { [isFollowing ? "$pull" : "$push"]: { following: userYou } }),
            user.updateOne({ _id: userYou }, { [isFollowing ? "$pull" : "$push"]: { followers: userMe } }),
        ])
        
        return res.status(200).json({ status: true, message: isFollowing ? "User unfollowed successfully" : "User followed successfully" })
    } catch (error) {
        res.status(500).json({ status: false, message: "internal server error", error: error.message })
    }
}

let sendFriendRequest = async (req, res) => {
    try {
        const senderId = req.userId
        const { receiverId } = req.params
        if (!senderId || !receiverId) return res.status(400).json({ status: false, message: "User IDs are required" })
        if (senderId === receiverId) return res.status(400).json({ status: false, message: "You cannot send friend request to yourself" })
        
        const [sender, receiver] = await Promise.all([user.findById(senderId), user.findById(receiverId)])
        if (!sender || !receiver) return res.status(404).json({ status: false, message: "User not found" })
        
        if (sender.following.includes(receiverId) && receiver.followers.includes(senderId)) return res.status(400).json({ status: false, message: "You are already friends" })
        if (sender.sentFriendRequests.includes(receiverId)) return res.status(400).json({ status: false, message: "Friend request already sent" })
        if (receiver.friendRequests.includes(senderId)) return res.status(400).json({ status: false, message: "Friend request already received" })
        
        await Promise.all([
            user.findByIdAndUpdate(senderId, { $push: { sentFriendRequests: receiverId } }),
            user.findByIdAndUpdate(receiverId, { $push: { friendRequests: senderId } }),
        ])
        
        const { createNotification } = await import("./notification.controller.js")
        await createNotification(receiverId, senderId, "friend_request")
        
        res.status(200).json({ status: true, message: "Friend request sent successfully" })
    } catch (error) {
        console.error("Error sending friend request:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let acceptFriendRequest = async (req, res) => {
    try {
        const receiverId = req.userId
        const { senderId } = req.params
        if (!receiverId || !senderId) return res.status(400).json({ status: false, message: "User IDs are required" })
        
        const [receiver, sender] = await Promise.all([user.findById(receiverId), user.findById(senderId)])
        if (!receiver || !sender) return res.status(404).json({ status: false, message: "User not found" })
        
        if (!receiver.friendRequests.includes(senderId)) return res.status(400).json({ status: false, message: "No friend request found" })
        
        await Promise.all([
            user.findByIdAndUpdate(receiverId, { $pull: { friendRequests: senderId }, $push: { following: senderId, followers: senderId } }),
            user.findByIdAndUpdate(senderId, { $pull: { sentFriendRequests: receiverId }, $push: { following: receiverId, followers: receiverId } }),
        ])
        
        const { createNotification } = await import("./notification.controller.js")
        await createNotification(senderId, receiverId, "friend_accept")
        
        res.status(200).json({ status: true, message: "Friend request accepted successfully" })
    } catch (error) {
        console.error("Error accepting friend request:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let rejectFriendRequest = async (req, res) => {
    try {
        const receiverId = req.userId
        const { senderId } = req.params
        if (!receiverId || !senderId) return res.status(400).json({ status: false, message: "User IDs are required" })
        
        const [receiver, sender] = await Promise.all([user.findById(receiverId), user.findById(senderId)])
        if (!receiver || !sender) return res.status(404).json({ status: false, message: "User not found" })
        
        if (!receiver.friendRequests.includes(senderId)) return res.status(400).json({ status: false, message: "No friend request found" })
        
        await Promise.all([
            user.findByIdAndUpdate(receiverId, { $pull: { friendRequests: senderId } }),
            user.findByIdAndUpdate(senderId, { $pull: { sentFriendRequests: receiverId } }),
        ])
        
        res.status(200).json({ status: true, message: "Friend request rejected successfully" })
    } catch (error) {
        console.error("Error rejecting friend request:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let getFriendRequests = async (req, res) => {
    try {
        const userId = req.userId
        const userData = await user.findById(userId).populate("friendRequests", "name username ProfilePicture").select("friendRequests")
        res.status(200).json({ status: true, data: userData.friendRequests })
    } catch (error) {
        console.error("Error getting friend requests:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let blockUser = async (req, res) => {
    try {
        const blockerId = req.userId
        const { userId } = req.params
        if (!blockerId || !userId) return res.status(400).json({ status: false, message: "User IDs are required" })
        if (blockerId === userId) return res.status(400).json({ status: false, message: "You cannot block yourself" })
        
        const [blocker, userToBlock] = await Promise.all([user.findById(blockerId), user.findById(userId)])
        if (!blocker || !userToBlock) return res.status(404).json({ status: false, message: "User not found" })
        
        if (blocker.blockedUsers.includes(userId)) return res.status(400).json({ status: false, message: "User is already blocked" })
        
        await Promise.all([
            user.findByIdAndUpdate(blockerId, { $push: { blockedUsers: userId }, $pull: { following: userId, followers: userId, friendRequests: userId, sentFriendRequests: userId } }),
            user.findByIdAndUpdate(userId, { $push: { blockedBy: blockerId }, $pull: { following: blockerId, followers: blockerId, friendRequests: blockerId, sentFriendRequests: blockerId } }),
        ])
        
        res.status(200).json({ status: true, message: "User blocked successfully" })
    } catch (error) {
        console.error("Error blocking user:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let unblockUser = async (req, res) => {
    try {
        const blockerId = req.userId
        const { userId } = req.params
        if (!blockerId || !userId) return res.status(400).json({ status: false, message: "User IDs are required" })
        
        const [blocker, userToUnblock] = await Promise.all([user.findById(blockerId), user.findById(userId)])
        if (!blocker || !userToUnblock) return res.status(404).json({ status: false, message: "User not found" })
        
        if (!blocker.blockedUsers.includes(userId)) return res.status(400).json({ status: false, message: "User is not blocked" })
        
        await Promise.all([
            user.findByIdAndUpdate(blockerId, { $pull: { blockedUsers: userId } }),
            user.findByIdAndUpdate(userId, { $pull: { blockedBy: blockerId } }),
        ])
        
        res.status(200).json({ status: true, message: "User unblocked successfully" })
    } catch (error) {
        console.error("Error unblocking user:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let getBlockedUsers = async (req, res) => {
    try {
        const userId = req.userId
        const userData = await user.findById(userId).populate("blockedUsers", "name username ProfilePicture").select("blockedUsers")
        res.status(200).json({ status: true, data: userData.blockedUsers })
    } catch (error) {
        console.error("Error getting blocked users:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let updateProfile = async (req, res) => {
    try {
        const userId = req.userId
        const { name, bio } = req.body
        const updateData = {}
        if (name) updateData.name = name
        if (bio !== undefined) updateData.bio = bio
        
        const updatedUser = await user.findByIdAndUpdate(userId, updateData, { new: true }).select("-password")
        res.status(200).json({ status: true, data: updatedUser, message: "Profile updated successfully" })
    } catch (error) {
        console.error("Error updating profile:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let updateProfilePicture = async (req, res) => {
    try {
        const userId = req.userId
        const file = req.file
        if (!file) return res.status(400).json({ status: false, message: "Profile picture is required" })
        if (!file.mimetype.startsWith("image/")) return res.status(400).json({ status: false, message: "Please upload an image file" })
        
        const { uploadToCloudinary } = await import("../utils/cloudinary.js")
        const result = await uploadToCloudinary(file.path, "profiles")
        if (!result) return res.status(500).json({ status: false, message: "Error uploading image" })
        
        const updatedUser = await user.findByIdAndUpdate(userId, { ProfilePicture: result.secure_url }, { new: true }).select("-password")
        res.status(200).json({ status: true, data: updatedUser, message: "Profile picture updated successfully" })
    } catch (error) {
        console.error("Error updating profile picture:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let getUserFriends = async (req, res) => {
    try {
        const userId = req.userId
        const userData = await user.findById(userId).populate("following", "name username ProfilePicture followers").select("following")
        
        const friends = userData.following.filter(friend => 
            friend.followers && friend.followers.includes(userId)
        )
        
        res.status(200).json({ status: true, data: friends })
    } catch (error) {
        console.error("Error getting user friends:", error)
        res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

let searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ status: false, message: "Search query is required" });
        
        const searchResults = await user.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: req.userId } // Exclude current user
        }).select("name username ProfilePicture").limit(10);
        
        res.status(200).json({ status: true, data: searchResults });
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ status: false, message: "Internal server error", error: error.message });
    }
};

export { register, verifyOTP, login, logout, checkAuthentication, getUser, suggestedUser, getUserById, followAndUnfollow, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequests, blockUser, unblockUser, getBlockedUsers, updateProfile, updateProfilePicture, getUserFriends, searchUsers }