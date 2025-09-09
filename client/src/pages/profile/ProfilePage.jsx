import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Button } from "@mui/material"
import { Close, Check, Clear } from "@mui/icons-material"
import { toast } from "react-toastify"
import { getCurrentUser } from "../../store/slices/userSlice"
import userService from "../../services/userService"
import api from "../../services/api"
import ProfileHeader from "../../components/profile/ProfileHeader"
import ProfileContent from "../../components/profile/ProfileContent"

const ProfilePage = () => {
    const { userId } = useParams()
    const dispatch = useDispatch()
    const { currentUser } = useSelector((state) => state.users)
    const { user: authUser } = useSelector((state) => state.auth)

    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showFriendsDialog, setShowFriendsDialog] = useState(false)
    const [showBlockedDialog, setShowBlockedDialog] = useState(false)
    const [userPosts, setUserPosts] = useState([])
    const [userPhotos, setUserPhotos] = useState([])
    const [userVideos, setUserVideos] = useState([])
    const [userShared, setUserShared] = useState([])
    const [viewedUser, setViewedUser] = useState(null)
    const [editForm, setEditForm] = useState({ name: "", bio: "" })
    const [friendsList, setFriendsList] = useState([])
    const [blockedList, setBlockedList] = useState([])
    const [friendRequests, setFriendRequests] = useState([])

    const isOwnProfile = !userId || userId === authUser?._id

    useEffect(() => {
        if (isOwnProfile) {
            dispatch(getCurrentUser())
        }
        loadUserData()
    }, [dispatch, isOwnProfile, userId])

    const loadUserData = async () => {
        try {
            const targetUserId = userId || authUser?._id
            if (!targetUserId) return

            // Load viewed user if not own profile
            if (!isOwnProfile) {
                const userResp = await userService.getUserById(targetUserId)
                setViewedUser(userResp.data.user)
            } else {
                setViewedUser(null)
            }

            // Fetch content in parallel for performance
            const [postsResponse, photosResponse, videosResponse, sharedResponse] = await Promise.all([
                api.get(`/posts/user/${targetUserId}`),
                api.get(`/posts/user/${targetUserId}?type=photos`),
                api.get(`/posts/user/${targetUserId}?type=videos`),
                api.get(`/posts/user/${targetUserId}?type=shared`),
            ])

            setUserPosts(postsResponse.data.data || [])
            setUserPhotos(photosResponse.data.data || [])
            setUserVideos(videosResponse.data.data || [])
            setUserShared(sharedResponse.data.data || [])

            // Load friends and blocked users if own profile
            if (isOwnProfile) {
                const friendsResponse = await api.get("/users/friend-requests")
                setFriendRequests(friendsResponse.data.data)

                const blockedResponse = await api.get("/users/blocked-users")
                setBlockedList(blockedResponse.data.data)
            }
        } catch (error) {
            console.error("Error loading user data:", error)
        }
    }

    const handleEditProfile = () => {
        setEditForm({ name: currentUser?.name || "", bio: currentUser?.bio || "" })
        setShowEditDialog(true)
    }

    const handleSaveProfile = async () => {
        try {
            await api.put("/users/profile", editForm)
            toast.success("Profile updated successfully!")
            setShowEditDialog(false)
            dispatch(getCurrentUser())
        } catch (error) {
            toast.error("Failed to update profile")
        }
    }

    const handleAcceptFriendRequest = async (senderId) => {
        try {
            await api.post(`/users/friend-request/${senderId}/accept`)
            toast.success("Friend request accepted!")
            loadUserData()
        } catch (error) {
            toast.error("Failed to accept friend request")
        }
    }

    const handleRejectFriendRequest = async (senderId) => {
        try {
            await api.post(`/users/friend-request/${senderId}/reject`)
            toast.success("Friend request rejected!")
            loadUserData()
        } catch (error) {
            toast.error("Failed to reject friend request")
        }
    }

    const handleUnblockUser = async (blockedUserId) => {
        try {
            await api.post(`/users/unblock/${blockedUserId}`)
            toast.success("User unblocked successfully!")
            loadUserData()
        } catch (error) {
            toast.error("Failed to unblock user")
        }
    }

    const user = isOwnProfile ? currentUser : viewedUser

    const relationship = (() => {
        if (!user || !authUser) return { isFriend: false, requestSent: false }
        const myId = authUser._id
        const targetId = user._id
        const iFollowHim = Array.isArray(authUser.following) && authUser.following.includes(targetId)
        const heFollowsMe = Array.isArray(user.following) && user.following.includes(myId)
        const isFriend = iFollowHim && heFollowsMe
        const requestSent = Array.isArray(authUser.sentFriendRequests) && authUser.sentFriendRequests.includes(targetId)
        return { isFriend, requestSent }
    })()

    return (
        <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 1, sm: 2, md: 3 }, backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
            <ProfileHeader user={user} isOwnProfile={isOwnProfile} userId={userId} userPosts={userPosts} friendRequests={friendRequests} onEditProfile={handleEditProfile} onShowFriendsDialog={() => setShowFriendsDialog(true)} relationship={relationship} />

            <ProfileContent user={user} isOwnProfile={isOwnProfile} userPosts={userPosts} userPhotos={userPhotos} userVideos={userVideos} userShared={userShared} onEditDialog={() => setShowEditDialog(true)} />

            {/* Edit Profile Dialog */}
            <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { mx: { xs: 2, sm: 3 }, width: { xs: "calc(100% - 32px)", sm: "auto" } } }}>
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1c1e21" }}>Edit Profile</Typography>
                        <IconButton onClick={() => setShowEditDialog(false)} sx={{ color: "#65676b" }}><Close /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField fullWidth label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#f0f2f5" } }} />
                    <TextField fullWidth label="Bio" multiline rows={3} value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Tell us about yourself..." sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#f0f2f5" } }} />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2 }}>
                    <Button onClick={() => setShowEditDialog(false)} sx={{ textTransform: "none", color: "#1877f2", fontWeight: 600, borderRadius: "6px" }}>Cancel</Button>
                    <Button onClick={handleSaveProfile} variant="contained" sx={{ textTransform: "none", backgroundColor: "#1877f2", fontWeight: 600, borderRadius: "6px", "&:hover": { backgroundColor: "#166fe5" } }}>Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* Friends Dialog */}
            <Dialog open={showFriendsDialog} onClose={() => setShowFriendsDialog(false)} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { mx: { xs: 2, sm: 3 }, width: { xs: "calc(100% - 32px)", sm: "auto" } } }}>
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1c1e21" }}>Friend Requests</Typography>
                        <IconButton onClick={() => setShowFriendsDialog(false)} sx={{ color: "#65676b" }}><Close /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {friendRequests.length > 0 ? (
                        <List sx={{ p: 0 }}>
                            {friendRequests.map((request) => (
                                <ListItem key={request._id} sx={{ px: 0, py: 2 }}>
                                    <ListItemAvatar>
                                        <Avatar src={request.sender?.ProfilePicture} sx={{ width: 60, height: 60 }}>{request.sender?.name?.charAt(0)}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={<Typography sx={{ fontWeight: 600, color: "#1c1e21" }}>{request.sender?.name}</Typography>} secondary={<Typography sx={{ color: "#65676b" }}>@{request.sender?.username}</Typography>} sx={{ ml: 2 }} />
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <IconButton onClick={() => handleAcceptFriendRequest(request.sender._id)} sx={{ color: "white", backgroundColor: "#42b883", "&:hover": { backgroundColor: "#369870" }, width: 36, height: 36 }}><Check /></IconButton>
                                        <IconButton onClick={() => handleRejectFriendRequest(request.sender._id)} sx={{ color: "white", backgroundColor: "#e41e3f", "&:hover": { backgroundColor: "#c41e3a" }, width: 36, height: 36 }}><Clear /></IconButton>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: "center", py: 4, color: "#65676b" }}>No pending friend requests</Typography>
                    )}
                </DialogContent>
            </Dialog>

            {/* Blocked Users Dialog */}
            <Dialog open={showBlockedDialog} onClose={() => setShowBlockedDialog(false)} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { mx: { xs: 2, sm: 3 }, width: { xs: "calc(100% - 32px)", sm: "auto" } } }}>
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1c1e21" }}>Blocked Users</Typography>
                        <IconButton onClick={() => setShowBlockedDialog(false)} sx={{ color: "#65676b" }}><Close /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {blockedList.length > 0 ? (
                        <List sx={{ p: 0 }}>
                            {blockedList.map((blockedUser) => (
                                <ListItem key={blockedUser._id} sx={{ px: 0, py: 2 }}>
                                    <ListItemAvatar>
                                        <Avatar src={blockedUser.ProfilePicture} sx={{ width: 60, height: 60 }}>{blockedUser.name?.charAt(0)}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={<Typography sx={{ fontWeight: 600, color: "#1c1e21" }}>{blockedUser.name}</Typography>} secondary={<Typography sx={{ color: "#65676b" }}>@{blockedUser.username}</Typography>} sx={{ ml: 2 }} />
                                    <Button onClick={() => handleUnblockUser(blockedUser._id)} variant="outlined" size="small" sx={{ textTransform: "none", borderColor: "#1877f2", color: "#1877f2", fontWeight: 600, borderRadius: "6px", "&:hover": { borderColor: "#166fe5", backgroundColor: "rgba(24, 119, 242, 0.04)" } }}>Unblock</Button>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: "center", py: 4, color: "#65676b" }}>No blocked users</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default ProfilePage