"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Chip,
} from "@mui/material"
import { Check, Close, MoreVert, PersonAdd, AccessTime } from "@mui/icons-material"
import { toast } from "react-toastify"
import {
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getUserFriends,
} from "../../store/slices/userSlice"

const FriendRequests = () => {
  const dispatch = useDispatch()
  const { friendRequests, isLoading } = useSelector((state) => state.users)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)

  useEffect(() => {
    dispatch(getFriendRequests())
  }, [dispatch])

  const handleAcceptRequest = async (senderId) => {
    try {
      await dispatch(acceptFriendRequest(senderId)).unwrap()
      toast.success("Friend request accepted!")
      dispatch(getFriendRequests())
      dispatch(getUserFriends())
    } catch (error) {
      toast.error(error.message || "Failed to accept friend request")
    }
  }

  const handleRejectRequest = async (senderId) => {
    try {
      await dispatch(rejectFriendRequest(senderId)).unwrap()
      toast.success("Friend request rejected")
      dispatch(getFriendRequests())
    } catch (error) {
      toast.error(error.message || "Failed to reject friend request")
    }
  }

  const handleMenuOpen = (event, request) => {
    setAnchorEl(event.currentTarget)
    setSelectedRequest(request)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedRequest(null)
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const requestTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - requestTime) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center", backgroundColor: "#ffffff", borderRadius: "12px" }}>
        <Typography color="#65676b" variant="body1">
          Loading friend requests...
        </Typography>
      </Box>
    )
  }

  if (friendRequests.length === 0) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e4e6ea",
        }}
      >
        <PersonAdd sx={{ fontSize: 80, color: "#1877f2", mb: 2, opacity: 0.6 }} />
        <Typography variant="h6" sx={{ color: "#1c1e21", mb: 1, fontWeight: 600 }}>
          No friend requests
        </Typography>
        <Typography variant="body2" sx={{ color: "#65676b", maxWidth: 300, mx: "auto" }}>
          When you receive friend requests, they'll show up here
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e4e6ea", overflow: "hidden" }}>
      <Box sx={{ p: 3, borderBottom: "1px solid #e4e6ea", backgroundColor: "#f8f9fa" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#1c1e21",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PersonAdd sx={{ color: "#1877f2", fontSize: 24 }} />
          Friend Requests
          <Chip
            label={friendRequests.length}
            size="small"
            sx={{
              backgroundColor: "#1877f2",
              color: "white",
              fontWeight: 600,
              fontSize: "12px",
            }}
          />
        </Typography>
      </Box>

      <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
        {friendRequests.map((request, index) => (
          <Box key={request._id}>
            <Card
              sx={{
                m: 0,
                borderRadius: 0,
                boxShadow: "none",
                border: "none",
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <Box sx={{ position: "relative", mr: 2 }}>
                      <Avatar
                        src={request.ProfilePicture}
                        sx={{
                          width: 64,
                          height: 64,
                          border: "3px solid #ffffff",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        {request.name?.charAt(0)}
                      </Avatar>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#1c1e21",
                          mb: 0.5,
                          fontSize: "1.1rem",
                        }}
                      >
                        {request.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#65676b",
                          mb: 1,
                          fontWeight: 500,
                        }}
                      >
                        @{request.username}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 14, color: "#8a8d91" }} />
                        <Typography variant="caption" sx={{ color: "#8a8d91", fontWeight: 500 }}>
                          {formatTimeAgo(request.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <IconButton
                    onClick={(e) => handleMenuOpen(e, request)}
                    sx={{
                      color: "#65676b",
                      "&:hover": {
                        backgroundColor: "#f0f2f5",
                        color: "#1877f2",
                      },
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<Check />}
                    onClick={() => handleAcceptRequest(request._id)}
                    sx={{
                      flex: 1,
                      backgroundColor: "#1877f2",
                      color: "white",
                      textTransform: "none",
                      borderRadius: "10px",
                      py: 1.2,
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      "&:hover": {
                        backgroundColor: "#166fe5",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Close />}
                    onClick={() => handleRejectRequest(request._id)}
                    sx={{
                      flex: 1,
                      borderColor: "#e4e6ea",
                      color: "#65676b",
                      textTransform: "none",
                      borderRadius: "10px",
                      py: 1.2,
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      "&:hover": {
                        borderColor: "#1877f2",
                        backgroundColor: "#f0f2f5",
                        color: "#1877f2",
                      },
                    }}
                  >
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
            {index < friendRequests.length - 1 && <Divider sx={{ borderColor: "#e4e6ea" }} />}
          </Box>
        ))}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1px solid #e4e6ea",
            minWidth: 220,
            mt: 1,
          },
        }}
      >
        {selectedRequest && (
          <>
            <MenuItem
              onClick={() => {
                handleAcceptRequest(selectedRequest._id)
                handleMenuClose()
              }}
              sx={{ py: 1.5, "&:hover": { backgroundColor: "#f0f2f5" } }}
            >
              <Check sx={{ mr: 2, color: "#42b883", fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Accept Request
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleRejectRequest(selectedRequest._id)
                handleMenuClose()
              }}
              sx={{ py: 1.5, "&:hover": { backgroundColor: "#f0f2f5" } }}
            >
              <Close sx={{ mr: 2, color: "#f56565", fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Reject Request
              </Typography>
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, "&:hover": { backgroundColor: "#f0f2f5" } }}>
              <Typography variant="body2" sx={{ color: "#65676b", fontWeight: 500, ml: 4 }}>
                View Profile
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  )
}

export default FriendRequests
