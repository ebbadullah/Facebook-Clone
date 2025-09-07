"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Typography, Avatar, Card, CardContent, IconButton, Grid, Button } from "@mui/material"
import { People, Message, MoreVert, PersonRemove } from "@mui/icons-material"
import { getUserFriends } from "../../store/slices/userSlice"
import { toast } from "react-toastify"

const FriendsList = () => {
  const dispatch = useDispatch()
  const { friends, isLoading } = useSelector((state) => state.users)
  const [selectedFriend, setSelectedFriend] = useState(null)

  useEffect(() => {
    dispatch(getUserFriends())
  }, [dispatch])

  const handleMessage = (friend) => {
    toast.info("Messaging feature coming soon!")
  }

  const handleRemoveFriend = (friend) => {
    toast.info("Remove friend feature coming soon!")
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center", backgroundColor: "#ffffff", borderRadius: "12px" }}>
        <Typography color="#65676b" variant="body1">
          Loading friends...
        </Typography>
      </Box>
    )
  }

  if (friends.length === 0) {
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
        <People sx={{ fontSize: 80, color: "#1877f2", mb: 2, opacity: 0.6 }} />
        <Typography variant="h6" sx={{ color: "#1c1e21", mb: 1, fontWeight: 600 }}>
          No friends yet
        </Typography>
        <Typography variant="body2" sx={{ color: "#65676b", maxWidth: 280, mx: "auto" }}>
          Start connecting with people to build your friend network
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e4e6ea", overflow: "hidden" }}>
      <Box sx={{ p: 3, borderBottom: "1px solid #e4e6ea", backgroundColor: "#f8f9fa" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#1c1e21", display: "flex", alignItems: "center", gap: 1 }}
        >
          <People sx={{ color: "#1877f2", fontSize: 24 }} />
          Your Friends ({friends.length})
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {friends.map((friend) => (
            <Grid item xs={12} sm={6} lg={4} key={friend._id}>
              <Card
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  border: "1px solid #e4e6ea",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(24,119,242,0.15)",
                    borderColor: "#1877f2",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <Avatar
                        src={friend.ProfilePicture}
                        sx={{
                          width: 56,
                          height: 56,
                          mr: 2,
                          border: "3px solid transparent",
                          transition: "border-color 0.2s ease",
                          "&:hover": { borderColor: "#1877f2" },
                        }}
                      >
                        {friend.name?.charAt(0)}
                      </Avatar>

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
                          {friend.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#65676b", fontWeight: 500 }}>
                          @{friend.username}
                        </Typography>
                      </Box>
                    </Box>

                    <IconButton
                      onClick={() => setSelectedFriend(friend)}
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

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      size="medium"
                      startIcon={<Message />}
                      onClick={() => handleMessage(friend)}
                      sx={{
                        flex: 1,
                        backgroundColor: "#1877f2",
                        color: "white",
                        textTransform: "none",
                        borderRadius: "10px",
                        py: 1.2,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        "&:hover": {
                          backgroundColor: "#166fe5",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Message
                    </Button>
                    <Button
                      variant="outlined"
                      size="medium"
                      startIcon={<PersonRemove />}
                      onClick={() => handleRemoveFriend(friend)}
                      sx={{
                        flex: 1,
                        borderColor: "#e4e6ea",
                        color: "#65676b",
                        textTransform: "none",
                        borderRadius: "10px",
                        py: 1.2,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        "&:hover": {
                          borderColor: "#1877f2",
                          backgroundColor: "#f0f2f5",
                          color: "#1877f2",
                        },
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default FriendsList
