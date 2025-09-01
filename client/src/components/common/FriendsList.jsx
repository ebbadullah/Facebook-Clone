import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { 
    Box, 
    Typography, 
    Avatar, 
    Card, 
    CardContent, 
    IconButton, 
    Grid,
    Button
} from "@mui/material"
import { 
    People, 
    Message, 
    MoreVert,
    PersonRemove
} from "@mui/icons-material"
import { getUserFriends } from "../../store/slices/userSlice"
import { toast } from "react-toastify"

const FriendsList = () => {
    const dispatch = useDispatch()
    const { friends, isLoading } = useSelector((state) => state.users)
    const [selectedFriend, setSelectedFriend] = useState(null)

    useEffect(() => {
        dispatch(getUserFriends())
    }, [dispatch])

    const handleMessage = (friend) => {
        // TODO: Implement messaging functionality
        toast.info("Messaging feature coming soon!")
    }

    const handleRemoveFriend = (friend) => {
        // TODO: Implement remove friend functionality
        toast.info("Remove friend feature coming soon!")
    }

    if (isLoading) {
        return (
            <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography color="text.secondary">Loading friends...</Typography>
            </Box>
        )
    }

    if (friends.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <People sx={{ fontSize: 64, color: "#e0e0e0", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No friends yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Start connecting with people to build your friend network
                </Typography>
            </Box>
        )
    }

    return (
        <Box>
            <Box sx={{ p: 2, borderBottom: "1px solid #e4e6ea" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1c1e21" }}>
                    Your Friends ({friends.length})
                </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    {friends.map((friend) => (
                        <Grid item xs={12} sm={6} md={4} key={friend._id}>
                            <Card sx={{ 
                                borderRadius: "12px", 
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
                                }
                            }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                                            <Avatar 
                                                src={friend.ProfilePicture} 
                                                sx={{ width: 48, height: 48, mr: 2 }}
                                            >
                                                {friend.name?.charAt(0)}
                                            </Avatar>
                                            
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1c1e21", mb: 0.5 }}>
                                                    {friend.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    @{friend.username}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <IconButton 
                                            onClick={() => setSelectedFriend(friend)}
                                            sx={{ color: "#65676b" }}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<Message />}
                                            onClick={() => handleMessage(friend)}
                                            sx={{
                                                flex: 1,
                                                backgroundColor: "#1877f2",
                                                color: "white",
                                                textTransform: "none",
                                                borderRadius: "8px",
                                                py: 1,
                                                "&:hover": { backgroundColor: "#166fe5" }
                                            }}
                                        >
                                            Message
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<PersonRemove />}
                                            onClick={() => handleRemoveFriend(friend)}
                                            sx={{
                                                flex: 1,
                                                borderColor: "#e4e6ea",
                                                color: "#65676b",
                                                textTransform: "none",
                                                borderRadius: "8px",
                                                py: 1,
                                                "&:hover": { 
                                                    borderColor: "#d8dadf",
                                                    backgroundColor: "#f0f2f5"
                                                }
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    )
}

export default FriendsList
