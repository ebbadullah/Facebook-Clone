import { Box, Card, Typography } from "@mui/material"
import { PlayArrow } from "@mui/icons-material"
import GalleryViewer from "../../Plugins/LightGallery/Index"

const VideosTab = ({ userVideos, user }) => {
    const handleVideoClick = (index) => {
        const galleryElement = document.querySelector(`.profile-videos-gallery-${index}`)
        if (galleryElement) {
            galleryElement.click()
        }
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
                        <Box key={video._id} sx={{ aspectRatio: "1", borderRadius: "8px", overflow: "hidden", cursor: "pointer", position: "relative", transition: "transform 0.2s ease", "&:hover": { transform: "scale(1.02)" } }} onClick={() => handleVideoClick(index)}>
                            <video src={video.media_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />

                            {/* Play button overlay */}
                            <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <PlayArrow sx={{ color: "white", fontSize: 24 }} />
                            </Box>

                            {/* Hidden gallery viewer for each video */}
                            <div style={{ display: "none" }}>
                                <GalleryViewer
                                    items={userVideos.map((v) => ({ url: v.media_url, type: "video", caption: v.caption || `Video by ${user?.name}`, alt: `Video from ${user?.name}'s profile` }))}
                                    settings={{ download: true, counter: true, showCloseIcon: true, closable: true, escKey: true, startIndex: index }}
                                    className={`profile-videos-gallery-${index}`}
                                />
                            </div>
                        </Box>
                    ))}
                </Box>
            </Card>
        </Box>
    )
}

export default VideosTab