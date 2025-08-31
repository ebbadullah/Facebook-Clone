import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Avatar, Typography, IconButton, Paper } from "@mui/material"
import { PlayArrow } from "@mui/icons-material"
import CreateStory from "./CreateStory"
import StoryViewer from "./StoryViewer"
import { fetchStories } from "../../store/slices/storySlice"

const Stories = () => {
    const dispatch = useDispatch()
    const { stories, loading } = useSelector((state) => state.stories)
    const { user } = useSelector((state) => state.auth)
    const [selectedStoryGroup, setSelectedStoryGroup] = useState(null)
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0)
    const [viewerOpen, setViewerOpen] = useState(false)

    useEffect(() => {
        dispatch(fetchStories())
    }, [dispatch])

    const groupedStories = stories.reduce((groups, story) => {
        const authorId = story.author?._id
        if (!groups[authorId]) {
            groups[authorId] = {
                author: story.author,
                stories: [],
            }
        }
        groups[authorId].stories.push(story)
        return groups
    }, {})

    const storyGroups = Object.values(groupedStories)

    const handleStoryClick = (groupIndex, storyIndex = 0) => {
        setSelectedStoryGroup(groupIndex)
        setSelectedStoryIndex(storyIndex)
        setViewerOpen(true)
    }

    const handleViewerClose = () => {
        setViewerOpen(false)
        setSelectedStoryGroup(null)
        setSelectedStoryIndex(0)
    }

    const selectedStories = selectedStoryGroup !== null ? storyGroups[selectedStoryGroup]?.stories || [] : []

    return (
        <Paper sx={{ p: 2, mb: 2, borderRadius: "12px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", border: "1px solid #e4e6ea" }}>
            <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1, "&::-webkit-scrollbar": { height: "6px" }, "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: "3px" }, "&::-webkit-scrollbar-thumb": { background: "#c1c1c1", borderRadius: "3px" } }}>
                {/* Create Story */}
                <CreateStory />

                {storyGroups.map((group, groupIndex) => {
                    const latestStory = group.stories[group.stories.length - 1] // Show latest story as preview
                    const hasMultipleStories = group.stories.length > 1

                    return (
                        <Box key={`${group.author._id}-${groupIndex}`} onClick={() => handleStoryClick(groupIndex)} sx={{ minWidth: "112px", height: "200px", borderRadius: "12px", overflow: "hidden", position: "relative", cursor: "pointer", background: `url(${latestStory.media_url}) center/cover`, border: "3px solid transparent", backgroundClip: "content-box", transition: "all 0.2s ease", "&:hover": { transform: "scale(1.02)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" } }}>
                            <Avatar sx={{ position: "absolute", top: 12, left: 12, width: 36, height: 36, border: "3px solid #1877f2" }} src={group.author?.ProfilePicture}>{group.author?.name?.charAt(0)}</Avatar>

                            {latestStory.media_type === "video" && (
                                <IconButton sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "rgba(255,255,255,0.9)", color: "#1877f2", width: 48, height: 48, "&:hover": { backgroundColor: "rgba(255,255,255,1)" } }}><PlayArrow sx={{ fontSize: "24px" }} /></IconButton>
                            )}

                            <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", p: 2 }}>
                                <Typography variant="caption" sx={{ color: "white", fontWeight: 600, fontSize: "12px", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{group.author?.name}</Typography>
                            </Box>
                        </Box>
                    )
                })}
            </Box>

            <StoryViewer open={viewerOpen} onClose={handleViewerClose} stories={selectedStories} initialIndex={selectedStoryIndex} />
        </Paper>
    )
}

export default Stories