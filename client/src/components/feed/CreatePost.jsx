"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Paper,
  Avatar,
  TextField,
  Button,
  Divider,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
} from "@mui/material"
import { PhotoLibrary, Videocam, EmojiEmotions, Close, LocationOn, Add } from "@mui/icons-material"
import { toast } from "react-toastify"
import { createPost } from "../../store/slices/postSlice"

const CreatePost = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { createPostLoading } = useSelector((state) => state.posts)

  const [open, setOpen] = useState(false)
  const [caption, setCaption] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    if (files.length > 0) {
      // Allow more than 5 files, but warn if exceeding 5
      const totalFiles = [...selectedFiles, ...files]

      if (totalFiles.length > 5 && selectedFiles.length < 5) {
        toast.info(
          `You've selected ${totalFiles.length} files. Only the first 5 will be displayed in the preview, but all will be uploaded.`,
        )
      }

      // Create preview URLs for new files
      const newUrls = totalFiles.map((file) => {
        // If file already has a preview URL, keep it
        const existingFileIndex = selectedFiles.findIndex((f) => f.name === file.name && f.size === file.size)
        if (existingFileIndex >= 0 && previewUrls[existingFileIndex]) {
          return previewUrls[existingFileIndex]
        }
        // Otherwise create a new preview URL
        return URL.createObjectURL(file)
      })

      setSelectedFiles(totalFiles)
      setPreviewUrls(newUrls)
    }
  }

  const removeFile = (index) => {
    const newFiles = [...selectedFiles]
    const newUrls = [...previewUrls]

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newUrls[index])

    newFiles.splice(index, 1)
    newUrls.splice(index, 1)

    setSelectedFiles(newFiles)
    setPreviewUrls(newUrls)
  }

  const handleSubmit = () => {
    if (!caption.trim()) {
      toast.error("Please enter a caption")
      return
    }

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one media file")
      return
    }

    const formData = {
      caption: caption.trim(),
      media: selectedFiles,
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

    // Clean up all preview URLs to prevent memory leaks
    previewUrls.forEach((url) => URL.revokeObjectURL(url))

    setSelectedFiles([])
    setPreviewUrls([])
  }

  return (
    <>
      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: "12px",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          border: "1px solid #e4e6ea",
        }}
        className="post-card"
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar src={user?.ProfilePicture} sx={{ width: 40, height: 40 }}>
            {user?.name?.charAt(0)}
          </Avatar>
          <TextField
            fullWidth
            placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
            variant="outlined"
            onClick={() => setOpen(true)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
                backgroundColor: "#f0f2f5",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#e4e6ea" },
                "& fieldset": { border: "none" },
                "& input": { cursor: "pointer", color: "#65676b" },
              },
            }}
          />
        </Box>

        <Divider sx={{ mb: 2, backgroundColor: "#e4e6ea" }} />

        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            startIcon={<Videocam sx={{ color: "#f3425f" }} />}
            sx={{
              color: "#65676b",
              textTransform: "none",
              fontWeight: 600,
              flex: 1,
              py: 1.5,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#f0f2f5" },
            }}
            onClick={() => setOpen(true)}
          >
            Live video
          </Button>
          <Button
            startIcon={<PhotoLibrary sx={{ color: "#45bd62" }} />}
            sx={{
              color: "#65676b",
              textTransform: "none",
              fontWeight: 600,
              flex: 1,
              py: 1.5,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#f0f2f5" },
            }}
            onClick={() => setOpen(true)}
          >
            Photo/video
          </Button>
          <Button
            startIcon={<EmojiEmotions sx={{ color: "#f7b928" }} />}
            sx={{
              color: "#65676b",
              textTransform: "none",
              fontWeight: 600,
              flex: 1,
              py: 1.5,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#f0f2f5" },
            }}
            onClick={() => setOpen(true)}
          >
            Feeling/activity
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            maxHeight: "95vh",
            height: "auto",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: "20px",
            position: "relative",
            borderBottom: "1px solid #e4e6ea",
            flexShrink: 0,
            py: 2,
          }}
        >
          Create post
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              backgroundColor: "#f0f2f5",
              width: 36,
              height: 36,
              "&:hover": { backgroundColor: "#e4e6ea" },
            }}
          >
            <Close sx={{ fontSize: "20px" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              p: 2,
              overflowY: "auto",
              flex: 1,
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": { background: "#e4e6ea", borderRadius: "3px" },
              "&::-webkit-scrollbar-thumb:hover": { background: "#d0d2d6" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar src={user?.ProfilePicture} sx={{ width: 40, height: 40 }}>
                {user?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#1c1e21" }}>
                  {user?.name}
                </Typography>
                <Button
                  size="small"
                  startIcon={<LocationOn sx={{ fontSize: "16px" }} />}
                  sx={{
                    textTransform: "none",
                    fontSize: "12px",
                    color: "#65676b",
                    p: 0,
                    minWidth: "auto",
                    "&:hover": { color: "#1877f2" },
                  }}
                >
                  Add location
                </Button>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder={`What's on your mind, ${user?.name?.split(" ")[0]}?`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": { border: "none", "& fieldset": { border: "none" }, fontSize: "18px" },
                "& textarea": { fontSize: "18px !important", lineHeight: "1.3", color: "#1c1e21" },
              }}
            />

            {previewUrls.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  {previewUrls.map((url, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={previewUrls.length === 1 ? 12 : previewUrls.length === 2 ? 6 : 4}
                      md={
                        previewUrls.length === 1 ? 12 : previewUrls.length === 2 ? 6 : previewUrls.length >= 3 ? 4 : 12
                      }
                      key={index}
                      sx={{ display: index >= 5 ? "none" : "block" }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          height: previewUrls.length === 1 ? 250 : 150,
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid #e4e6ea",
                        }}
                      >
                        {selectedFiles[index]?.type?.startsWith("video") ? (
                          <video src={url} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        )}
                        <IconButton
                          onClick={() => removeFile(index)}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            color: "white",
                            width: 32,
                            height: 32,
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                          }}
                        >
                          <Close sx={{ fontSize: "18px" }} />
                        </IconButton>

                        {previewUrls.length > 5 && index === 4 && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0,0,0,0.5)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "24px",
                              fontWeight: "bold",
                            }}
                          >
                            +{previewUrls.length - 5}
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Box
              sx={{
                border: "2px dashed #e4e6ea",
                borderRadius: "12px",
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#f8f9fa",
                transition: "all 0.2s ease",
                "&:hover": { borderColor: "#1877f2", backgroundColor: "#f0f2f5" },
              }}
              onClick={() => document.getElementById("file-input").click()}
            >
              <PhotoLibrary sx={{ fontSize: 40, color: "#65676b", mb: 1 }} />
              <Typography variant="h6" sx={{ color: "#1c1e21", mb: 1, fontWeight: 600, fontSize: "16px" }}>
                Add Photos/Videos
              </Typography>
              <Typography variant="body2" sx={{ color: "#65676b", fontSize: "14px" }}>
                {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : "or drag and drop"}
              </Typography>
              {selectedFiles.length > 0 && selectedFiles.length < 5 && (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  sx={{
                    mt: 1.5,
                    borderRadius: "20px",
                    borderColor: "#1877f2",
                    color: "#1877f2",
                    "&:hover": { borderColor: "#166fe5", backgroundColor: "rgba(24, 119, 242, 0.04)" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    document.getElementById("file-input").click()
                  }}
                >
                  Add More
                </Button>
              )}
            </Box>

            <input
              id="file-input"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
              multiple
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: "1px solid #e4e6ea", flexShrink: 0 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={createPostLoading || !caption.trim()}
            sx={{
              py: 1.5,
              fontSize: "16px",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              backgroundColor: "#1877f2",
              "&:hover": { backgroundColor: "#166fe5" },
              "&:disabled": { backgroundColor: "#e4e6ea", color: "#bcc0c4" },
            }}
          >
            {createPostLoading ? <CircularProgress size={24} color="inherit" /> : "Post"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CreatePost
