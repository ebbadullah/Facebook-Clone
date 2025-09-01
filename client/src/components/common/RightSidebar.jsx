import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Typography, Avatar, Button, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import { Circle, MoreHoriz, Search, PersonAdd, Check, Close } from "@mui/icons-material"
import { getSuggestedUsers, followUser, sendFriendRequest } from "../../store/slices/userSlice"
import { toast } from "react-toastify"

const RightSidebar = () => {
    const dispatch = useDispatch()
    const { suggestedUsers, currentUser } = useSelector((state) => state.users)

    useEffect(() => {
        dispatch(getSuggestedUsers())
    }, [dispatch])

    const handleFollow = (userId) => {
        dispatch(followUser(userId))
    }

    const handleSendFriendRequest = async (userId) => {
        try {
            await dispatch(sendFriendRequest(userId)).unwrap()
            toast.success("Friend request sent!")
        } catch (error) {
            toast.error(error.message || "Failed to send friend request")
        }
    }

    const contacts = [
        { id: 1, name: "Ali Raza", online: true },
        { id: 2, name: "Hassan Shah", online: true },
        { id: 3, name: "Umer Farooq", online: false },
        { id: 4, name: "Bilal Ahmed", online: true },
        { id: 5, name: "Faizan Khan", online: false },
    ]

    const getRelationshipStatus = (user) => {
        if (!currentUser) return 'none'
        
        // Check if already following
        if (currentUser.following && currentUser.following.includes(user._id)) {
            return 'following'
        }
        
        // Check if friend request already sent
        if (currentUser.sentFriendRequests && currentUser.sentFriendRequests.includes(user._id)) {
            return 'request_sent'
        }
        
        // Check if friend request received
        if (currentUser.friendRequests && currentUser.friendRequests.includes(user._id)) {
            return 'request_received'
        }
        
        return 'none'
    }

    const renderActionButtons = (user) => {
        const status = getRelationshipStatus(user)
        
        switch (status) {
            case 'following':
                return (
                    <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handleFollow(user._id)}
                        sx={{ 
                            flex: 1, 
                            textTransform: "none", 
                            fontSize: { xs: "12px", sm: "13px" }, 
                            fontWeight: 600, 
                            py: 0.8, 
                            borderColor: "#e4e6ea", 
                            color: "#65676b", 
                            borderRadius: "6px", 
                            "&:hover": { backgroundColor: "#f0f2f5", borderColor: "#d8dadf" } 
                        }}
                    >
                        Unfollow
                    </Button>
                )
            case 'request_sent':
                return (
                    <Button 
                        variant="outlined" 
                        size="small" 
                        disabled
                        sx={{ 
                            flex: 1, 
                            textTransform: "none", 
                            fontSize: { xs: "12px", sm: "13px" }, 
                            fontWeight: 600, 
                            py: 0.8, 
                            borderColor: "#e4e6ea", 
                            color: "#65676b", 
                            borderRadius: "6px",
                            opacity: 0.6
                        }}
                    >
                        Request Sent
                    </Button>
                )
            case 'request_received':
                return (
                    <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                        <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<Check />}
                            sx={{ 
                                flex: 1, 
                                textTransform: "none", 
                                fontSize: { xs: "12px", sm: "13px" }, 
                                fontWeight: 600, 
                                py: 0.8, 
                                backgroundColor: "#4caf50", 
                                borderRadius: "6px", 
                                "&:hover": { backgroundColor: "#45a049" } 
                            }}
                        >
                            Accept
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<Close />}
                            sx={{ 
                                flex: 1, 
                                textTransform: "none", 
                                fontSize: { xs: "12px", sm: "13px" }, 
                                fontWeight: 600, 
                                py: 0.8, 
                                borderColor: "#f44336", 
                                color: "#f44336", 
                                borderRadius: "6px", 
                                "&:hover": { backgroundColor: "#ffebee", borderColor: "#d32f2f" } 
                            }}
                        >
                            Reject
                        </Button>
                    </Box>
                )
            default:
                return (
                    <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                        <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<PersonAdd />}
                            onClick={() => handleSendFriendRequest(user._id)}
                            sx={{ 
                                flex: 1, 
                                textTransform: "none", 
                                fontSize: { xs: "12px", sm: "13px" }, 
                                fontWeight: 600, 
                                py: 0.8, 
                                backgroundColor: "#1877f2", 
                                borderRadius: "6px", 
                                "&:hover": { backgroundColor: "#166fe5" } 
                            }}
                        >
                            Add Friend
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={() => handleFollow(user._id)}
                            sx={{ 
                                flex: 1, 
                                textTransform: "none", 
                                fontSize: { xs: "12px", sm: "13px" }, 
                                fontWeight: 600, 
                                py: 0.8, 
                                borderColor: "#e4e6ea", 
                                color: "#65676b", 
                                borderRadius: "6px", 
                                "&:hover": { backgroundColor: "#f0f2f5", borderColor: "#d8dadf" } 
                            }}
                        >
                            Follow
                        </Button>
                    </Box>
                )
        }
    }

    return (
        <Box sx={{ width: "100%", height: "100%", overflowY: "auto", backgroundColor: "white", "&::-webkit-scrollbar": { width: "8px" }, "&::-webkit-scrollbar-track": { background: "#f1f1f1" }, "&::-webkit-scrollbar-thumb": { background: "#c1c1c1", borderRadius: "4px" } }}>
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
                {/* Sponsored Section */}
                <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: { xs: "16px", sm: "17px" }, fontWeight: 600, color: "#65676b", mb: 2 }}>Sponsored</Typography>

                    <Box sx={{ display: "flex", alignItems: "center", p: { xs: 1.5, sm: 2 }, borderRadius: "8px", cursor: "pointer", transition: "background-color 0.2s ease", "&:hover": { backgroundColor: "#f0f2f5" } }}>
                        <Avatar src="/placeholder.svg?height=80&width=80" sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, mr: 2, borderRadius: "8px" }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: { xs: "13px", sm: "14px" }, fontWeight: 600, color: "#1c1e21", mb: 0.5 }}>Learn Web Development</Typography>
                            <Typography sx={{ fontSize: { xs: "12px", sm: "13px" }, color: "#65676b", lineHeight: 1.3 }}>Master modern web technologies with our comprehensive courses.</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Contacts Section */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Typography sx={{ fontSize: { xs: "16px", sm: "17px" }, fontWeight: 600, color: "#65676b" }}>Contacts</Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button sx={{ minWidth: "auto", width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, borderRadius: "50%", color: "#65676b", "&:hover": { backgroundColor: "#f0f2f5" } }}><Search sx={{ fontSize: "16px" }} /></Button>
                            <Button sx={{ minWidth: "auto", width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, borderRadius: "50%", color: "#65676b", "&:hover": { backgroundColor: "#f0f2f5" } }}><MoreHoriz sx={{ fontSize: "16px" }} /></Button>
                        </Box>
                    </Box>

                    <List sx={{ p: 0 }}>
                        {contacts.map((contact) => (
                            <ListItem key={contact.id} sx={{ px: 1, py: 1, borderRadius: "8px", cursor: "pointer", transition: "background-color 0.2s ease", "&:hover": { backgroundColor: "#f0f2f5" } }}>
                                <ListItemAvatar>
                                    <Box sx={{ position: "relative" }}>
                                        <Avatar sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}>{contact.name.split(" ").map((n) => n[0]).join("")}</Avatar>
                                        {contact.online && <Circle sx={{ position: "absolute", bottom: -2, right: -2, width: { xs: 10, sm: 12 }, height: { xs: 10, sm: 12 }, color: "#42b883", backgroundColor: "white", borderRadius: "50%" }} />}
                                    </Box>
                                </ListItemAvatar>
                                <ListItemText primary={contact.name} sx={{ "& .MuiListItemText-primary": { fontSize: { xs: "13px", sm: "14px" }, fontWeight: 500, color: "#1c1e21" } }} />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* People You May Know Section */}
                <Box>
                    <Typography sx={{ fontSize: { xs: "16px", sm: "17px" }, fontWeight: 600, color: "#65676b", mb: 2 }}>People you may know</Typography>

                    <List sx={{ p: 0 }}>
                        {suggestedUsers.slice(0, 4).map((user) => (
                            <ListItem key={user._id} sx={{ px: 1, py: 2, flexDirection: "column", alignItems: "flex-start", borderRadius: "8px", transition: "background-color 0.2s ease", "&:hover": { backgroundColor: "#f0f2f5" } }}>
                                <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 1.5 }}>
                                    <Avatar src={user.ProfilePicture} sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, mr: 2 }}>{user.name.charAt(0)}</Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontSize: { xs: "13px", sm: "14px" }, fontWeight: 600, color: "#1c1e21", lineHeight: 1.2 }}>{user.name}</Typography>
                                        <Typography sx={{ fontSize: { xs: "11px", sm: "12px" }, color: "#65676b", lineHeight: 1.2 }}>@{user.username}</Typography>
                                    </Box>
                                </Box>

                                {renderActionButtons(user)}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </Box>
    )
}

export default RightSidebar