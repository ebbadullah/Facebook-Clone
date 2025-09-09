import { Box, Paper, Avatar, Typography, Button, IconButton } from "@mui/material"
import { Edit, PhotoLibrary, PhotoCamera, PersonAdd, Message } from "@mui/icons-material"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { getCurrentUser } from "../../store/slices/userSlice"
import api from "../../services/api"

const ProfileHeader = ({ user, isOwnProfile, userId, userPosts, friendRequests, onEditProfile, onShowFriendsDialog, relationship }) => {
    const dispatch = useDispatch()

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB")
            return
        }

        try {
            const formData = new FormData()
            formData.append("profilePicture", file)

            await api.put("/users/profile-picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            toast.success("Profile picture updated successfully!")
            dispatch(getCurrentUser())
        } catch (error) {
            toast.error("Failed to update profile picture")
        }
    }

    const handleSendFriendRequest = async () => {
        try {
            await api.post(`/users/friend-request/${userId}`)
            toast.success("Friend request sent!")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send friend request")
        }
    }

    return (
        <Paper sx={{ borderRadius: { xs: 0, sm: "8px" }, overflow: "hidden", mb: { xs: 1, sm: 2 }, boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)", backgroundColor: "white" }}>
            {/* Cover Photo Section */}
            <Box sx={{ height: { xs: "200px", sm: "320px", md: "400px" }, background: "linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)", position: "relative", display: "flex", alignItems: "flex-end" }}>
                {/* Profile Picture */}
                <Box sx={{ position: "relative", width: "100%" }}>
                    <Avatar src={user?.ProfilePicture} sx={{ width: { xs: 120, sm: 160, md: 200 }, height: { xs: 120, sm: 160, md: 200 }, position: "absolute", bottom: { xs: -60, sm: -80, md: -100 }, left: { xs: 20, sm: 30, md: 40 }, border: "4px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontSize: { xs: "2rem", sm: "3rem", md: "4rem" } }}>{user?.name?.charAt(0)}</Avatar>
                    {isOwnProfile && (
                        <IconButton sx={{ position: "absolute", bottom: { xs: -60, sm: -80, md: -100 }, left: { xs: 20, sm: 30, md: 40 }, width: { xs: 120, sm: 160, md: 200 }, height: { xs: 120, sm: 160, md: 200 }, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.4)", color: "white", "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" } }} onClick={() => document.getElementById("profile-picture-input").click()}>
                            <PhotoCamera sx={{ fontSize: { xs: "20px", sm: "24px", md: "32px" } }} />
                        </IconButton>
                    )}
                    <input id="profile-picture-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleProfilePictureChange} />
                </Box>
            </Box>

            {/* Profile Info Section */}
            <Box sx={{ pt: { xs: 8, sm: 10, md: 14 }, pb: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3, md: 5 } }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "flex-start" }, gap: { xs: 2, md: 0 } }}>
                    {/* User Info */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: "#1c1e21", fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" }, mb: 0.5, lineHeight: 1.2 }}>{user?.name}</Typography>
                        <Typography variant="h6" sx={{ color: "#65676b", mb: { xs: 2, md: 3 }, fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" } }}>@{user?.username}</Typography>

                        {/* Stats */}
                        <Box sx={{ display: "flex", gap: { xs: 3, sm: 4, md: 6 }, mb: { xs: 2, md: 3 }, flexWrap: "wrap" }}>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1c1e21", fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" } }}>{userPosts.length}</Typography>
                                <Typography variant="body2" sx={{ color: "#65676b", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Posts</Typography>
                            </Box>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1c1e21", fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" } }}>{user?.followers?.length || 0}</Typography>
                                <Typography variant="body2" sx={{ color: "#65676b", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Followers</Typography>
                            </Box>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1c1e21", fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" } }}>{user?.following?.length || 0}</Typography>
                                <Typography variant="body2" sx={{ color: "#65676b", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Following</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 }, flexDirection: { xs: "row", sm: "row" }, width: { xs: "100%", md: "auto" }, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                        {isOwnProfile ? (
                            <>
                                <Button startIcon={<Edit />} onClick={onEditProfile} sx={{ textTransform: "none", fontWeight: 600, borderRadius: "6px", px: { xs: 2, sm: 3 }, py: 1, backgroundColor: "#e4e6ea", color: "#1c1e21", fontSize: { xs: "0.875rem", sm: "1rem" }, "&:hover": { backgroundColor: "#d8dadf" } }}>
                                    <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Edit profile</Box>
                                    <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>Edit</Box>
                                </Button>
                                <Button startIcon={<PhotoLibrary />} onClick={onShowFriendsDialog} sx={{ textTransform: "none", fontWeight: 600, borderRadius: "6px", px: { xs: 2, sm: 3 }, py: 1, backgroundColor: "#e4e6ea", color: "#1c1e21", fontSize: { xs: "0.875rem", sm: "1rem" }, "&:hover": { backgroundColor: "#d8dadf" } }}>
                                    <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Friends ({friendRequests.length})</Box>
                                    <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>Friends</Box>
                                </Button>
                            </>
                        ) : (
                            <>
                                {relationship?.isFriend ? (
                                    <Button startIcon={<Message />} sx={{ textTransform: "none", fontWeight: 600, borderRadius: "6px", px: { xs: 2, sm: 3 }, py: 1, backgroundColor: "#e4e6ea", color: "#1c1e21", fontSize: { xs: "0.875rem", sm: "1rem" }, "&:hover": { backgroundColor: "#d8dadf" } }}>Friends</Button>
                                ) : relationship?.requestSent ? (
                                    <Button disabled sx={{ textTransform: "none", fontWeight: 600, borderRadius: "6px", px: { xs: 2, sm: 3 }, py: 1, backgroundColor: "#e4e6ea", color: "#1c1e21", fontSize: { xs: "0.875rem", sm: "1rem" } }}>Request sent</Button>
                                ) : (
                                    <Button startIcon={<PersonAdd />} onClick={handleSendFriendRequest} sx={{ textTransform: "none", fontWeight: 600, borderRadius: "6px", px: { xs: 2, sm: 3 }, py: 1, backgroundColor: "#1877f2", color: "white", fontSize: { xs: "0.875rem", sm: "1rem" }, "&:hover": { backgroundColor: "#166fe5" } }}>
                                        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Add friend</Box>
                                        <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>Add</Box>
                                    </Button>
                                )}
                            </>
                        )}
                    </Box>
                </Box>

                {/* Bio Section */}
                {user?.bio && (
                    <Typography variant="body1" sx={{ mt: { xs: 2, md: 3 }, maxWidth: "600px", lineHeight: 1.6, color: "#1c1e21", fontSize: { xs: "0.875rem", sm: "1rem" } }}>{user.bio}</Typography>
                )}
            </Box>
        </Paper>
    )
}

export default ProfileHeader