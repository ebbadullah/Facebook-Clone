import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Dialog, DialogContent, Box, IconButton, Typography, Avatar, LinearProgress, Tooltip } from "@mui/material"
import { Close as CloseIcon, NavigateBefore as PrevIcon, NavigateNext as NextIcon, Favorite as LikeIcon, FavoriteBorder as UnlikeIcon, Visibility as ViewIcon } from "@mui/icons-material"
import { toast } from "react-toastify"
import { toggleStoryLike } from "../../store/slices/storySlice"
import StoryPlayer from "../../Plugins/VideoJs/StoryPlayer"

const StoryViewer = ({ open, onClose, stories, initialIndex = 0 }) => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [progress, setProgress] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const progressInterval = useRef(null)
    const currentStory = stories[currentIndex]

    const startProgressTimer = () => {
        progressInterval.current = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(progressInterval.current)
                    return 0
                }
                return prevProgress + 1
            })
        }, 1000)
    }

    useEffect(() => {
        if (open) {
            startProgressTimer()
        } else if (progressInterval.current) {
            clearInterval(progressInterval.current)
        }
        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current)
        }
    }, [open])

    const handleNext = () => currentIndex < stories.length - 1 ? setCurrentIndex(currentIndex + 1) : onClose()
    const handlePrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1)

    const handleLike = async () => {
        try {
            await dispatch(toggleStoryLike(currentStory._id)).unwrap()
        } catch {
            toast.error("Failed to like story")
        }
    }

    const handlePause = () => { setIsPlaying(false); if (progressInterval.current) clearInterval(progressInterval.current) }
    const handleResume = () => { setIsPlaying(true); startProgressTimer() }

    const isLiked = currentStory?.likes?.includes(user?._id)

    if (!open || !stories.length || !currentStory) return null

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false} PaperProps={{ sx: { backgroundColor: "black", borderRadius: 0, width: "100vw", height: "100vh", maxWidth: "100vw", maxHeight: "100vh" } }}>
            <DialogContent sx={{ p: 0, position: "relative" }}>
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }}>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 4, backgroundColor: "rgba(255,255,255,0.3)", "& .MuiLinearProgress-bar": { backgroundColor: "white" } }} />
                </Box>

                <Box sx={{ position: "absolute", top: 16, left: 16, right: 16, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }} onMouseEnter={handlePause} onMouseLeave={handleResume}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar src={currentStory.author?.ProfilePicture} sx={{ width: 40, height: 40, mr: 2 }}>{currentStory.author?.name?.charAt(0)}</Avatar>
                        <Box>
                            <Typography variant="body1" color="white" fontWeight="bold">{currentStory.author?.name}</Typography>
                            <Typography variant="caption" color="rgba(255,255,255,0.7)">{new Date(currentStory.createdAt).toLocaleTimeString()}</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: "white" }}><CloseIcon /></IconButton>
                </Box>

                {currentIndex > 0 && <IconButton onClick={handlePrev} sx={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 2, color: "white", backgroundColor: "rgba(0,0,0,0.3)", "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" } }}><PrevIcon /></IconButton>}
                {currentIndex < stories.length - 1 && <IconButton onClick={handleNext} sx={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 2, color: "white", backgroundColor: "rgba(0,0,0,0.3)", "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" } }}><NextIcon /></IconButton>}

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", width: "100vw", position: "relative" }}>
                    {currentStory.media_type === "video" ? <StoryPlayer url={currentStory.media_url} playing={isPlaying} onEnded={handleNext} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} width="100%" height="100%" /> : <img src={currentStory.media_url || "/placeholder.svg"} alt="Story" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />}
                </Box>

                {currentStory.caption && <Box sx={{ position: "absolute", bottom: 80, left: 16, right: 16, zIndex: 2 }}><Typography variant="body1" color="white" sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)", backgroundColor: "rgba(0,0,0,0.3)", padding: 1, borderRadius: 1 }}>{currentStory.caption}</Typography></Box>}

                <Box sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 2, display: "flex", gap: 1 }}>
                    <Tooltip title={`${currentStory.views?.length || 0} views`}><Box sx={{ display: "flex", alignItems: "center", color: "white" }}><ViewIcon sx={{ mr: 0.5 }} /><Typography variant="caption">{currentStory.views?.length || 0}</Typography></Box></Tooltip>
                    <Tooltip title={isLiked ? "Unlike" : "Like"}><IconButton onClick={handleLike} sx={{ color: isLiked ? "red" : "white", backgroundColor: "rgba(0,0,0,0.3)", "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" } }}>{isLiked ? <LikeIcon /> : <UnlikeIcon />}</IconButton></Tooltip>
                </Box>

                <Box sx={{ position: "absolute", top: 80, left: 16, right: 16, zIndex: 2, display: "flex", gap: 1 }}>
                    {stories.map((_, index) => (
                        <Box key={index} sx={{ flex: 1, height: 2, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 1, overflow: "hidden" }}>
                            <Box sx={{ width: index === currentIndex ? `${progress}%` : index < currentIndex ? "100%" : "0%", height: "100%", backgroundColor: "white", transition: "width 0.1s linear" }} />
                        </Box>
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default StoryViewer
