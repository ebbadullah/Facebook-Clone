import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Box } from "@mui/material"

import CreatePost from "../../components/feed/CreatePost"
import Stories from "../../components/feed/Stories"
import PostList from "../../components/feed/PostList"
import { getAllPosts } from "../../store/slices/postSlice"

const HomePage = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllPosts())
    }, [dispatch])

    return (
        <Box
            sx={{
                maxWidth: { xs: "100%", sm: "600px", md: "680px" },
                mx: "auto",
                px: { xs: 0, sm: 1 },
            }}
        >
            <Stories />
            <CreatePost />
            <PostList />
        </Box>
    )
}

export default HomePage
