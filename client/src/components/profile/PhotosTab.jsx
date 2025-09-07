import { Box, Card, Typography } from "@mui/material"
import GalleryViewer from "../../Plugins/LightGallery/Index"
import { useState, useMemo } from "react"

const PhotosTab = ({ userPhotos, user }) => {
    
    const [galleryOpen, setGalleryOpen] = useState(false)
    const [startIndex, setStartIndex] = useState(0)

    // Filter only photos (not videos)
    const userPhotosOnly = useMemo(() => {
        return userPhotos.filter(photo => 
            !photo.media_type || 
            photo.media_type === "image" || 
            photo.media_type === "photo"
        )
    }, [userPhotos])

    const handlePhotoClick = (index) => {
        setStartIndex(index)
        setGalleryOpen(true)
    }

    if (userPhotosOnly.length === 0) {
        return (
            <Card sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)" }}>
                <Typography variant="h5" sx={{ color: "#65676b", mb: 1, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>No photos yet</Typography>
                <Typography variant="body1" sx={{ color: "#65676b", fontSize: { xs: "0.875rem", sm: "1rem" } }}>Share your first photo to get started!</Typography>
            </Card>
        )
    }

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1c1e21", mb: 3, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}>Photos ({userPhotosOnly.length})</Typography>

            <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)" }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" }, gap: { xs: 1, sm: 2 } }}>
                    {userPhotosOnly.map((photo, index) => (
                        <Box key={photo._id} sx={{ aspectRatio: "1", borderRadius: "8px", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s ease", "&:hover": { transform: "scale(1.02)" } }} onClick={() => handlePhotoClick(index)}>
                            <img src={photo.media_url || "/placeholder.svg?height=200&width=200&query=profile photo"} alt={`Photo by ${user?.name}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </Box>
                    ))}
                </Box>
                
                {/* Gallery Viewer - Only render when needed */}
                {galleryOpen && (
                    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999 }}>
                        <GalleryViewer
                            items={userPhotosOnly.map((p) => ({ 
                                url: p.media_url, 
                                type: "image", // Force type to image
                                caption: p.caption || `Photo by ${user?.name}`, 
                                alt: `Photo from ${user?.name}'s profile` 
                            }))}
                            settings={{ 
                                download: true, 
                                zoom: true, 
                                actualSize: true, 
                                showZoomInOutIcons: true, 
                                rotate: true, 
                                flipHorizontal: true, 
                                flipVertical: true, 
                                counter: true, 
                                showCloseIcon: true, 
                                closable: true, 
                                escKey: true, 
                                startIndex: startIndex,
                                showThumbByDefault: userPhotosOnly.length > 1
                            }}
                            onClosed={() => setGalleryOpen(false)}
                        />
                    </div>
                )}
            </Card>
        </Box>
    )
}

export default PhotosTab