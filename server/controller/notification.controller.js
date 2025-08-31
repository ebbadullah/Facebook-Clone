import Notification from "../model/notification.schema.js"
import User from "../model/user.schema.js"

export const createNotification = async (recipientId, senderId, type, data = {}) => {
    try {
        const sender = await User.findById(senderId).select("name username")
        if (!sender) return

        let message = ""
        switch (type) {
            case "like": message = `${sender.name} liked your post`; break
            case "comment": message = `${sender.name} commented on your post`; break
            case "friend_request": message = `${sender.name} sent you a friend request`; break
            case "friend_accept": message = `${sender.name} accepted your friend request`; break
            case "story_like": message = `${sender.name} liked your story`; break
            case "share": message = `${sender.name} shared your post`; break
            default: message = `${sender.name} interacted with your content`
        }

        const notification = new Notification({ recipient: recipientId, sender: senderId, type, message, ...data })
        await notification.save()
        return notification
    } catch (error) {
        console.error("Error creating notification:", error)
        throw error
    }
}

export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.userId
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20
        const skip = (page - 1) * limit

        const notifications = await Notification.find({ recipient: userId })
            .populate("sender", "name username ProfilePicture")
            .populate("post", "caption media_url")
            .populate("story", "caption media_url")
            .populate("comment", "content")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await Notification.countDocuments({ recipient: userId })

        res.status(200).json({
            status: true,
            data: notifications,
            pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalNotifications: total, hasNext: page * limit < total },
        })
    } catch (error) {
        console.error("Error getting notifications:", error)
        res.status(500).json({ status: false, message: "Error fetching notifications", error: error.message })
    }
}

export const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params
        const userId = req.userId

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { isRead: true },
            { new: true }
        )

        if (!notification) return res.status(404).json({ status: false, message: "Notification not found" })

        res.status(200).json({ status: true, data: notification, message: "Notification marked as read" })
    } catch (error) {
        console.error("Error marking notification as read:", error)
        res.status(500).json({ status: false, message: "Error updating notification", error: error.message })
    }
}

export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.userId
        await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true })
        res.status(200).json({ status: true, message: "All notifications marked as read" })
    } catch (error) {
        console.error("Error marking all notifications as read:", error)
        res.status(500).json({ status: false, message: "Error updating notifications", error: error.message })
    }
}

export const getUnreadNotificationCount = async (req, res) => {
    try {
        const userId = req.userId
        const count = await Notification.countDocuments({ recipient: userId, isRead: false })
        res.status(200).json({ status: true, data: { unreadCount: count } })
    } catch (error) {
        console.error("Error getting unread notification count:", error)
        res.status(500).json({ status: false, message: "Error fetching notification count", error: error.message })
    }
}