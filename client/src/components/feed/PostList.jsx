import { useSelector } from "react-redux"
import { Box, CircularProgress, Typography, Paper } from "@mui/material"
import { PostAdd } from "@mui/icons-material"
import PostCard from "./PostCard"

const PostList = () => {
    const { posts, isLoading } = useSelector((state) => state.posts)

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress size={40} sx={{ color: "#1877f2", mb: 2 }} />
                    <Typography variant="body2" sx={{ color: "#65676b" }}>
                        Loading posts...
                    </Typography>
                </Box>
            </Box>
        )
    }

    if (!posts || posts.length === 0) {
        return (
            <Paper sx={{ textAlign: "center", py: 6, px: 4, borderRadius: "12px", backgroundColor: "white", border: "1px solid #e4e6ea", }}>
                <PostAdd sx={{ fontSize: 64, color: "#e4e6ea", mb: 2 }} />
                <Typography variant="h6" sx={{ color: "#1c1e21", mb: 1, fontWeight: 600 }}>
                    No posts yet
                </Typography>
                <Typography variant="body2" sx={{ color: "#65676b", maxWidth: 300, mx: "auto" }}>
                    When you and your friends share posts, they'll appear here. Start by creating your first post!
                </Typography>
            </Paper>
        )
    }

    return (
        <Box>
            {posts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
        </Box>
    )
}

export default PostList
