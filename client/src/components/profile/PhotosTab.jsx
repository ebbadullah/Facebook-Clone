import { Box, Card, Typography } from "@mui/material"
import GalleryViewer from "../../Plugins/LightGallery/Index"

const PhotosTab = ({ userPhotos, user }) => {
    const handlePhotoClick = (index) => {
        const galleryElement = document.querySelector(`.profile-photos-gallery-${index}`)
        if (galleryElement) {
            galleryElement.click()
        }
    }

    if (userPhotos.length === 0) {
        return (
            <Card sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)" }}>
                <Typography variant="h5" sx={{ color: "#65676b", mb: 1, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>No photos yet</Typography>
                <Typography variant="body1" sx={{ color: "#65676b", fontSize: { xs: "0.875rem", sm: "1rem" } }}>Share your first photo to get started!</Typography>
            </Card>
        )
    }

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1c1e21", mb: 3, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}>Photos ({userPhotos.length})</Typography>

            <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)" }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" }, gap: { xs: 1, sm: 2 } }}>
                    {userPhotos.map((photo, index) => (
                        <Box key={photo._id} sx={{ aspectRatio: "1", borderRadius: "8px", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s ease", "&:hover": { transform: "scale(1.02)" } }} onClick={() => handlePhotoClick(index)}>
                            <img src={photo.media_url || "/placeholder.svg?height=200&width=200&query=profile photo"} alt={`Photo by ${user?.name}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                            {/* Hidden gallery viewer for each photo */}
                            <div style={{ display: "none" }}>
                                <GalleryViewer
                                    items={userPhotos.map((p) => ({ url: p.media_url, type: p.media_type || "image", caption: p.caption || `Photo by ${user?.name}`, alt: `Photo from ${user?.name}'s profile` }))}
                                    settings={{ download: true, zoom: true, actualSize: true, showZoomInOutIcons: true, rotate: true, flipHorizontal: true, flipVertical: true, counter: true, showCloseIcon: true, closable: true, escKey: true, startIndex: index }}
                                    className={`profile-photos-gallery-${index}`}
                                />
                            </div>
                        </Box>
                    ))}
                </Box>
            </Card>
        </Box>
    )
}

export default PhotosTab