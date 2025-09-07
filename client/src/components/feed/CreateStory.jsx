"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Avatar,
  CircularProgress,
} from "@mui/material"
import {
  Add as AddIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Videocam as VideocamIcon,
} from "@mui/icons-material"
import { toast } from "react-toastify"
import { createStory } from "../../store/slices/storySlice"

const CreateStory = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.stories)

  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [caption, setCaption] = useState("")
  const [preview, setPreview] = useState("")

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setSelectedFile(null)
    setCaption("")
    setPreview("")
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error("Please select an image or video file")
        return
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size should be less than 50MB")
        return
      }

      setSelectedFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file")
      return
    }

    try {
      await dispatch(createStory({ file: selectedFile, caption })).unwrap()
      toast.success("Story created successfully!")
      handleClose()
    } catch (error) {
      toast.error(error || "Failed to create story")
    }
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          p: 2,
          borderRadius: 2,
          border: "2px dashed #ccc",
          "&:hover": { borderColor: "primary.main", backgroundColor: "#f5f5f5" },
        }}
        onClick={handleOpen}
      >
        <Avatar src={user?.ProfilePicture} sx={{ width: 60, height: 60, mb: 1 }}>
          {user?.name?.charAt(0)}
        </Avatar>
        <IconButton
          color="primary"
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <AddIcon />
        </IconButton>
        <Typography variant="caption" color="text.secondary">
          Create Story
        </Typography>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle
          sx={{
            flexShrink: 0,
            borderBottom: "1px solid #e4e6ea",
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1c1e21" }}>
              Create Story
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                backgroundColor: "#f0f2f5",
                width: 36,
                height: 36,
                "&:hover": { backgroundColor: "#e4e6ea" },
              }}
            >
              <CloseIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 0,
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 3,
              overflowY: "auto",
              flex: 1,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#e4e6ea",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#d0d2d6",
              },
            }}
          >
            <Box sx={{ mb: 3 }}>
              <input
                accept="image/*,video/*"
                style={{ display: "none" }}
                id="story-file-input"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="story-file-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={selectedFile?.type.startsWith("video/") ? <VideocamIcon /> : <PhotoCameraIcon />}
                  fullWidth
                  sx={{
                    mb: 2,
                    py: 1.5,
                    borderColor: "#1877f2",
                    color: "#1877f2",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "#166fe5",
                      backgroundColor: "rgba(24, 119, 242, 0.04)",
                    },
                  }}
                >
                  {selectedFile ? "Change File" : "Select Image or Video"}
                </Button>
              </label>

              {selectedFile && (
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    color: "#65676b",
                    backgroundColor: "#f0f2f5",
                    p: 1.5,
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  Selected: {selectedFile.name}
                </Typography>
              )}

              {preview && (
                <Box
                  sx={{
                    mb: 2,
                    textAlign: "center",
                    border: "1px solid #e4e6ea",
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  {selectedFile?.type.startsWith("image/") ? (
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <video
                      src={preview}
                      controls
                      style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        borderRadius: 8,
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>

            <TextField
              fullWidth
              label="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              multiline
              rows={3}
              placeholder="What's on your mind?"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "&:hover fieldset": {
                    borderColor: "#1877f2",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1877f2",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1877f2",
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            borderTop: "1px solid #e4e6ea",
            flexShrink: 0,
            gap: 1,
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              textTransform: "none",
              color: "#65676b",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#f0f2f5",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!selectedFile || loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#1877f2",
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                backgroundColor: "#166fe5",
              },
              "&:disabled": {
                backgroundColor: "#e4e6ea",
                color: "#bcc0c4",
              },
            }}
          >
            {loading ? "Creating..." : "Create Story"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CreateStory
