import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Paper, Avatar, TextField, Button, Divider, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material"
import { PhotoLibrary, Videocam, EmojiEmotions, Close, LocationOn } from "@mui/icons-material"
import { toast } from "react-toastify"
import { createPost } from "../../store/slices/postSlice"

const CreatePost = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { createPostLoading } = useSelector((state) => state.posts)

    const [open, setOpen] = useState(false)
    const [caption, setCaption] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState("")

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleSubmit = () => {
        if (!caption.trim()) {
            toast.error("Please enter a caption")
            return
        }

        if (!selectedFile) {
            toast.error("Please select a media file")
            return
        }

        const formData = {
            caption: caption.trim(),
            media: selectedFile,
        }

        dispatch(createPost(formData)).then((result) => {
            if (result.type === "posts/create/fulfilled") {
                toast.success("Post created successfully!")
                handleClose()
            }
        })
    }

    const handleClose = () => {
        setOpen(false)
        setCaption("")
        setSelectedFile(null)
        setPreviewUrl("")
    }

    return (
        <>
            <Paper sx={{ p: 2, mb: 2, borderRadius: "12px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", border: "1px solid #e4e6ea" }} className="post-card">
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Avatar src={user?.ProfilePicture} sx={{ width: 40, height: 40 }}>{user?.name?.charAt(0)}</Avatar>
                    <TextField fullWidth placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`} variant="outlined" onClick={() => setOpen(true)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px", backgroundColor: "#f0f2f5", cursor: "pointer", "&:hover": { backgroundColor: "#e4e6ea" }, "& fieldset": { border: "none" }, "& input": { cursor: "pointer", color: "#65676b" } } }} />
                </Box>

                <Divider sx={{ mb: 2, backgroundColor: "#e4e6ea" }} />

                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                    <Button startIcon={<Videocam sx={{ color: "#f3425f" }} />} sx={{ color: "#65676b", textTransform: "none", fontWeight: 600, flex: 1, py: 1.5, borderRadius: "8px", "&:hover": { backgroundColor: "#f0f2f5" } }} onClick={() => setOpen(true)}>Live video</Button>
                    <Button startIcon={<PhotoLibrary sx={{ color: "#45bd62" }} />} sx={{ color: "#65676b", textTransform: "none", fontWeight: 600, flex: 1, py: 1.5, borderRadius: "8px", "&:hover": { backgroundColor: "#f0f2f5" } }} onClick={() => setOpen(true)}>Photo/video</Button>
                    <Button startIcon={<EmojiEmotions sx={{ color: "#f7b928" }} />} sx={{ color: "#65676b", textTransform: "none", fontWeight: 600, flex: 1, py: 1.5, borderRadius: "8px", "&:hover": { backgroundColor: "#f0f2f5" } }} onClick={() => setOpen(true)}>Feeling/activity</Button>
                </Box>
            </Paper>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "12px", maxHeight: "90vh" } }}>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 700, fontSize: "20px", position: "relative", borderBottom: "1px solid #e4e6ea" }}>
                    Create post
                    <IconButton onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8, backgroundColor: "#f0f2f5", width: 36, height: 36, "&:hover": { backgroundColor: "#e4e6ea" } }}><Close sx={{ fontSize: "20px" }} /></IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <Avatar src={user?.ProfilePicture} sx={{ width: 40, height: 40 }}>{user?.name?.charAt(0)}</Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600}>{user?.name}</Typography>
                                <Button size="small" startIcon={<LocationOn sx={{ fontSize: "16px" }} />} sx={{ textTransform: "none", fontSize: "12px", color: "#65676b", p: 0, minWidth: "auto" }}>Add location</Button>
                            </Box>
                        </Box>

                        <TextField fullWidth multiline rows={4} placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`} value={caption} onChange={(e) => setCaption(e.target.value)} variant="outlined" sx={{ mb: 2, "& .MuiOutlinedInput-root": { border: "none", "& fieldset": { border: "none" }, fontSize: "24px" }, "& textarea": { fontSize: "24px !important", lineHeight: "1.2" } }} />

                        {previewUrl && (
                            <Box sx={{ mb: 2, position: "relative" }}>
                                {selectedFile?.type.startsWith("video") ? (
                                    <video src={previewUrl} controls style={{ width: "100%", maxHeight: "400px", borderRadius: "12px", objectFit: "cover" }} />
                                ) : (
                                    <img src={previewUrl || "/placeholder.svg?height=400&width=600"} alt="Preview" style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "12px" }} />
                                )}
                                <IconButton onClick={() => { setSelectedFile(null); setPreviewUrl("") }} sx={{ position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.6)", color: "white", width: 32, height: 32, "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" } }}><Close sx={{ fontSize: "18px" }} /></IconButton>
                            </Box>
                        )}

                        <Box sx={{ border: "2px dashed #e4e6ea", borderRadius: "12px", p: 4, textAlign: "center", cursor: "pointer", backgroundColor: "#f8f9fa", transition: "all 0.2s ease", "&:hover": { borderColor: "#1877f2", backgroundColor: "#f0f2f5" } }} onClick={() => document.getElementById("file-input").click()}>
                            <PhotoLibrary sx={{ fontSize: 48, color: "#65676b", mb: 2 }} />
                            <Typography variant="h6" sx={{ color: "#1c1e21", mb: 1, fontWeight: 600 }}>Add Photos/Videos</Typography>
                            <Typography variant="body2" sx={{ color: "#65676b" }}>or drag and drop</Typography>
                        </Box>

                        <input id="file-input" type="file" accept="image/*,video/*" onChange={handleFileSelect} style={{ display: "none" }} />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, borderTop: "1px solid #e4e6ea" }}>
                    <Button fullWidth variant="contained" onClick={handleSubmit} disabled={createPostLoading || !caption.trim()} sx={{ py: 1.5, fontSize: "16px", fontWeight: 600, textTransform: "none", borderRadius: "8px", backgroundColor: "#1877f2", "&:hover": { backgroundColor: "#166fe5" }, "&:disabled": { backgroundColor: "#e4e6ea", color: "#bcc0c4" } }}>
                        {createPostLoading ? <CircularProgress size={24} color="inherit" /> : "Post"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CreatePost