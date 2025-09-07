import { useState } from "react"
import { Box, Card, Typography, Modal, IconButton } from "@mui/material"
import { PlayArrow, Close } from "@mui/icons-material"
import VideoJSPlayer from "../../Plugins/VideoJs/Index"
// import { VideoJSPlayer } from "../../Plugins/VideoJS/Index"

const VideosTab = ({ userVideos, user }) => {
    const [selectedVideo, setSelectedVideo] = useState(null)
    const [openModal, setOpenModal] = useState(false)

    const handleVideoClick = (video, index) => {
        setSelectedVideo({...video, index})
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        setSelectedVideo(null)
    }

    if (userVideos.length === 0) {
        return (
            <Card sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)" }}>
                <Typography variant="h5" sx={{ color: "#65676b", mb: 1, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>No videos yet</Typography>
                <Typography variant="body1" sx={{ color: "#65676b", fontSize: { xs: "0.875rem", sm: "1rem" } }}>Share your first video to get started!</Typography>
            </Card>
        )
    }

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1c1e21", mb: 3, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}>Videos ({userVideos.length})</Typography>

            <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)" }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" }, gap: { xs: 1, sm: 2 } }}>
                    {userVideos.map((video, index) => (
                        <Box 
                            key={video._id} 
                            sx={{ 
                                aspectRatio: "1", 
                                borderRadius: "8px", 
                                overflow: "hidden", 
                                cursor: "pointer", 
                                position: "relative", 
                                transition: "transform 0.2s ease", 
                                "&:hover": { transform: "scale(1.02)" } 
                            }} 
                            onClick={() => handleVideoClick(video, index)}
                        >
                            <video 
                                src={video.media_url} 
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                muted 
                                preload="metadata"
                            />
                            
                            {/* Play button overlay */}
                            <Box sx={{ 
                                position: "absolute", 
                                top: "50%", 
                                left: "50%", 
                                transform: "translate(-50%, -50%)", 
                                backgroundColor: "rgba(0, 0, 0, 0.6)", 
                                borderRadius: "50%", 
                                width: 48, 
                                height: 48, 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center" 
                            }}>
                                <PlayArrow sx={{ color: "white", fontSize: 24 }} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Card>

            {/* Video Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(5px)",
                }}
            >
                <Box sx={{
                    position: "relative",
                    width: "90%",
                    maxWidth: "800px",
                    maxHeight: "90vh",
                    bgcolor: "black",
                    borderRadius: "8px",
                    overflow: "hidden",
                    outline: "none"
                }}>
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 1000,
                            color: "white",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.7)"
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                    
                    {selectedVideo && (
                        <VideoJSPlayer
                            src={selectedVideo.media_url}
                            width="100%"
                            height="auto"
                            controls={true}
                            autoplay={true}
                            responsive={true}
                            style={{
                                maxHeight: "90vh",
                                objectFit: "contain"
                            }}
                        />
                    )}
                    
                    {selectedVideo?.caption && (
                        <Box sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                            p: 2,
                            color: "white"
                        }}>
                            <Typography variant="body1">
                                {selectedVideo.caption}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Modal>
        </Box>
    )
}

export default VideosTab