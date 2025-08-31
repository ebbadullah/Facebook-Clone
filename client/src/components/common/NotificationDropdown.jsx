import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Badge, IconButton, Menu, MenuItem, Typography, Box, Avatar, Button, Chip } from "@mui/material"
import { Notifications as NotificationsIcon, Favorite, Comment, PersonAdd, Share, MarkEmailRead } from "@mui/icons-material"
import { toast } from "react-toastify"
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationCount } from "../../store/slices/notificationSlice"

const NotificationDropdown = () => {
    const dispatch = useDispatch()
    const { notifications, unreadCount, loading } = useSelector((state) => state.notifications)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    useEffect(() => {
        dispatch(getUnreadNotificationCount())
    }, [dispatch])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
        dispatch(fetchNotifications({ page: 1, limit: 10 }))
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            try {
                await dispatch(markNotificationAsRead(notification._id)).unwrap()
            } catch (error) {
                toast.error("Failed to mark notification as read")
            }
        }
        handleClose()
    }

    const handleMarkAllAsRead = async () => {
        try {
            await dispatch(markAllNotificationsAsRead()).unwrap()
            toast.success("All notifications marked as read")
        } catch (error) {
            toast.error("Failed to mark all notifications as read")
        }
    }

    const getNotificationIcon = (type) => {
        const iconProps = { fontSize: "small", sx: { width: 20, height: 20 } }
        switch (type) {
            case "like":
                return <Favorite {...iconProps} sx={{ ...iconProps.sx, color: "#e91e63" }} />
            case "comment":
                return <Comment {...iconProps} sx={{ ...iconProps.sx, color: "#2196f3" }} />
            case "friend_request":
            case "friend_accept":
                return <PersonAdd {...iconProps} sx={{ ...iconProps.sx, color: "#4caf50" }} />
            case "share":
                return <Share {...iconProps} sx={{ ...iconProps.sx, color: "#ff9800" }} />
            case "story_like":
                return <Favorite {...iconProps} sx={{ ...iconProps.sx, color: "#e91e63" }} />
            default:
                return <NotificationsIcon {...iconProps} sx={{ ...iconProps.sx, color: "#757575" }} />
        }
    }

    const formatTimeAgo = (timestamp) => {
        const now = new Date()
        const notificationTime = new Date(timestamp)
        const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60))

        if (diffInMinutes < 1) return "Just now"
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
        return `${Math.floor(diffInMinutes / 1440)}d ago`
    }

    return (
        <>
            <IconButton color="inherit" onClick={handleClick} sx={{ position: "relative", p: 1.5, borderRadius: "12px", transition: "all 0.2s ease", "&:hover": { backgroundColor: "rgba(0,0,0,0.04)", transform: "scale(1.05)" } }}>
                <Badge badgeContent={unreadCount} color="error" sx={{ "& .MuiBadge-badge": { fontSize: "0.75rem", minWidth: "18px", height: "18px", borderRadius: "9px", fontWeight: 600 } }}>
                    <NotificationsIcon sx={{ color: "#65676b", fontSize: "24px", transition: "color 0.2s ease" }} />
                </Badge>
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ sx: { width: 420, maxHeight: 600, borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.08)", mt: 1 } }} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
                <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "18px" }}>Notifications</Typography>
                    {unreadCount > 0 && (
                        <Button size="small" onClick={handleMarkAllAsRead} startIcon={<MarkEmailRead sx={{ fontSize: "16px" }} />} sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)", border: "1px solid", borderRadius: "20px", textTransform: "none", fontSize: "12px", fontWeight: 600, px: 2, "&:hover": { backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.5)" } }}>Mark all read</Button>
                    )}
                </Box>

                {loading ? (
                    <Box sx={{ p: 4, textAlign: "center" }}><Typography color="text.secondary">Loading notifications...</Typography></Box>
                ) : notifications.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <NotificationsIcon sx={{ fontSize: 48, color: "#e0e0e0", mb: 2 }} />
                        <Typography color="text.secondary" variant="body1">No notifications yet</Typography>
                        <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>When you get notifications, they'll show up here</Typography>
                    </Box>
                ) : (
                    <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                        {notifications.map((notification, index) => (
                            <MenuItem key={notification._id} onClick={() => handleNotificationClick(notification)} sx={{ p: 0, "&:hover": { backgroundColor: "#f8f9fa" } }}>
                                <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%", p: 2, borderLeft: !notification.isRead ? "4px solid #1877f2" : "4px solid transparent", backgroundColor: !notification.isRead ? "rgba(24, 119, 242, 0.02)" : "transparent" }}>
                                    <Box sx={{ position: "relative", mr: 2 }}>
                                        <Avatar src={notification.sender?.ProfilePicture} sx={{ width: 48, height: 48 }}>{notification.sender?.name?.charAt(0)}</Avatar>
                                        <Box sx={{ position: "absolute", bottom: -2, right: -2, backgroundColor: "white", borderRadius: "50%", p: 0.5, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>{getNotificationIcon(notification.type)}</Box>
                                    </Box>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="body2" sx={{ fontWeight: !notification.isRead ? 600 : 400, color: "#1c1e21", lineHeight: 1.4, mb: 0.5 }}>{notification.message}</Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Typography variant="caption" sx={{ color: "#65676b", fontSize: "12px" }}>{formatTimeAgo(notification.createdAt)}</Typography>
                                            {!notification.isRead && <Chip label="New" size="small" sx={{ height: 16, fontSize: "10px", backgroundColor: "#1877f2", color: "white", fontWeight: 600 }} />}
                                        </Box>
                                    </Box>
                                </Box>
                            </MenuItem>
                        ))}
                    </Box>
                )}
            </Menu>
        </>
    )
}

export default NotificationDropdown