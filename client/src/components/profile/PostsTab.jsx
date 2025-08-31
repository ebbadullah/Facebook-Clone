import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material"
import PostCard from "../feed/PostCard"
import CreatePost from "../feed/CreatePost"

const PostsTab = ({ user, isOwnProfile, userPosts, userPhotos, onEditDialog, setTabValue }) => {
    return (
        <Grid container spacing={{ xs: 1, sm: 2 }}>
            {/* Left Sidebar */}
            <Grid item xs={12} md={5} lg={4}>
                {/* Intro Card */}
                <Card sx={{ mb: { xs: 1, sm: 2 }, borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)", backgroundColor: "white" }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1c1e21", mb: 2, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>Intro</Typography>

                        {user?.bio ? (
                            <Typography variant="body1" sx={{ color: "#1c1e21", mb: 2, lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "1rem" } }}>{user.bio}</Typography>
                        ) : (
                            <Typography variant="body1" sx={{ color: "#65676b", mb: 2, fontSize: { xs: "0.875rem", sm: "1rem" } }}>No bio available</Typography>
                        )}

                        {isOwnProfile && (
                            <Button fullWidth onClick={onEditDialog} sx={{ textTransform: "none", fontWeight: 600, borderRadius: "6px", mb: 2, backgroundColor: "#e4e6ea", color: "#1c1e21", py: 1, "&:hover": { backgroundColor: "#d8dadf" } }}>Edit bio</Button>
                        )}

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📧</Box>
                                <Typography variant="body2" sx={{ color: "#1c1e21", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>{user?.email}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📅</Box>
                                <Typography variant="body2" sx={{ color: "#1c1e21", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>Joined {new Date(user?.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Photos Card */}
                <Card sx={{ borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)", backgroundColor: "white" }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1c1e21", fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>Photos</Typography>
                            <Button onClick={() => setTabValue(1)} sx={{ textTransform: "none", fontWeight: 600, color: "#1877f2", fontSize: { xs: "0.8rem", sm: "0.875rem" }, "&:hover": { backgroundColor: "rgba(24, 119, 242, 0.04)" } }}>See all ({userPhotos.length})</Button>
                        </Box>

                        {userPhotos.length > 0 ? (
                            <Grid container spacing={1}>
                                {userPhotos.slice(0, 9).map((photo, index) => (
                                    <Grid item xs={4} key={photo._id}>
                                        <Box sx={{ width: "100%", height: { xs: "70px", sm: "90px" }, borderRadius: "8px", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s ease", "&:hover": { transform: "scale(1.05)" } }} onClick={() => setTabValue(1)}>
                                            <img src={photo.media_url || "/placeholder.svg?height=90&width=90&query=profile photo"} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography variant="body2" sx={{ color: "#65676b", textAlign: "center", py: 3, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>No photos yet</Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={7} lg={8}>
                {isOwnProfile && <CreatePost />}

                <Box sx={{ mt: { xs: 1, sm: 2 } }}>
                    {userPosts.length > 0 ? (
                        userPosts.map((post) => <PostCard key={post._id} post={post} />)
                    ) : (
                        <Card sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)" }}>
                            <Typography variant="h5" sx={{ color: "#65676b", mb: 1, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>No posts yet</Typography>
                            <Typography variant="body1" sx={{ color: "#65676b", fontSize: { xs: "0.875rem", sm: "1rem" } }}>{isOwnProfile ? "Share your first post to get started!" : "This user hasn't posted anything yet."}</Typography>
                        </Card>
                    )}
                </Box>
            </Grid>
        </Grid>
    )
}

export default PostsTab