import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Typography, Avatar, Button, Card, CardContent, IconButton, Badge, Menu, MenuItem, Divider } from "@mui/material"
import { People, Check, Close, MoreVert as MoreVertIcon } from "@mui/icons-material"
import { toast } from "react-toastify"
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest, getUserFriends } from "../../store/slices/userSlice"

const FriendRequests = () => {
    const dispatch = useDispatch()
    const { friendRequests, isLoading } = useSelector((state) => state.users)
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedRequest, setSelectedRequest] = useState(null)

    useEffect(() => {
        dispatch(getFriendRequests())
    }, [dispatch])

    const handleAcceptRequest = async (senderId) => {
        try {
            await dispatch(acceptFriendRequest(senderId)).unwrap()
            toast.success("Friend request accepted!")
            dispatch(getFriendRequests())
            dispatch(getUserFriends())
        } catch (error) {
            toast.error(error.message || "Failed to accept friend request")
        }
    }

    const handleRejectRequest = async (senderId) => {
        try {
            await dispatch(rejectFriendRequest(senderId)).unwrap()
            toast.success("Friend request rejected")
            dispatch(getFriendRequests())
        } catch (error) {
            toast.error(error.message || "Failed to reject friend request")
        }
    }

    const handleMenuOpen = (event, request) => {
        setAnchorEl(event.currentTarget)
        setSelectedRequest(request)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedRequest(null)
    }

    const formatTimeAgo = (timestamp) => {
        const now = new Date()
        const requestTime = new Date(timestamp)
        const diffInMinutes = Math.floor((now - requestTime) / (1000 * 60))

        if (diffInMinutes < 1) return "Just now"
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
        return `${Math.floor(diffInMinutes / 1440)}d ago`
    }

    if (isLoading) {
        return (
            <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography color="text.secondary">Loading friend requests...</Typography>
            </Box>
        )
    }

    if (friendRequests.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <People sx={{ fontSize: 48, color: "#e0e0e0", mb: 2 }} />
                <Typography color="text.secondary" variant="body1">No friend requests</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>When you receive friend requests, they'll show up here</Typography>
            </Box>
        )
    }

    return (
        <Box>
            <Box sx={{ p: 2, borderBottom: "1px solid #e4e6ea" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1c1e21" }}>Friend Requests ({friendRequests.length})</Typography>
            </Box>

            <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                {friendRequests.map((request) => (
                    <Card key={request._id} sx={{ m: 1, borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                        <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                                    <Avatar src={request.ProfilePicture} sx={{ width: 56, height: 56, mr: 2 }}>{request.name?.charAt(0)}</Avatar>
                                    
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1c1e21", mb: 0.5 }}>{request.name}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>@{request.username}</Typography>
                                        <Typography variant="caption" color="text.secondary">{formatTimeAgo(request.createdAt)}</Typography>
                                    </Box>
                                </Box>

                                <IconButton onClick={(e) => handleMenuOpen(e, request)} sx={{ color: "#65676b" }}>
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                <Button variant="contained" startIcon={<Check />} onClick={() => handleAcceptRequest(request._id)} sx={{ flex: 1, backgroundColor: "#1877f2", color: "white", textTransform: "none", borderRadius: "8px", py: 1, "&:hover": { backgroundColor: "#166fe5" } }}>Accept</Button>
                                <Button variant="outlined" startIcon={<Close />} onClick={() => handleRejectRequest(request._id)} sx={{ flex: 1, borderColor: "#e4e6ea", color: "#65676b", textTransform: "none", borderRadius: "8px", py: 1, "&:hover": { borderColor: "#d8dadf", backgroundColor: "#f0f2f5" } }}>Reject</Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.08)", minWidth: 200 } }}>
                {selectedRequest && (
                    <>
                        <MenuItem onClick={() => { handleAcceptRequest(selectedRequest._id); handleMenuClose() }}>
                            <Check sx={{ mr: 2, color: "#4caf50" }} /> Accept Request
                        </MenuItem>
                        <MenuItem onClick={() => { handleRejectRequest(selectedRequest._id); handleMenuClose() }}>
                            <Close sx={{ mr: 2, color: "#f44336" }} /> Reject Request
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleMenuClose}>
                            <Typography variant="body2" color="text.secondary">View Profile</Typography>
                        </MenuItem>
                    </>
                )}
            </Menu>
        </Box>
    )
}

export default FriendRequests