"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Typography, Tabs, Tab, Paper, Container } from "@mui/material"
import { People, PersonAdd, Group } from "@mui/icons-material"
import { getFriendRequests, getUserFriends } from "../../store/slices/userSlice"
import FriendRequests from "../../components/common/FriendRequests"
import FriendsList from "../../components/common/FriendsList"

const FriendsPage = () => {
  const dispatch = useDispatch()
  const { friendRequests, friends } = useSelector((state) => state.users)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    dispatch(getFriendRequests())
    dispatch(getUserFriends())
  }, [dispatch])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`friends-tabpanel-${index}`}
      aria-labelledby={`friends-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: { xs: 2, md: 3 } }}>{children}</Box>}
    </div>
  )

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 2, md: 4 },
        mb: 4,
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Box sx={{ mb: { xs: 2, md: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1c1e21",
            mb: 1,
            fontSize: { xs: "1.75rem", md: "2.125rem" },
          }}
        >
          Friends
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#65676b",
            fontSize: { xs: "14px", md: "16px" },
          }}
        >
          Manage your friends and friend requests
        </Typography>
      </Box>

      <Paper
        sx={{
          borderRadius: { xs: "12px", md: "16px" },
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          border: "1px solid #e4e6ea",
          backgroundColor: "#ffffff",
        }}
      >
        <Box sx={{ borderBottom: "1px solid #e4e6ea" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="friends tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "14px", md: "16px" },
                minHeight: { xs: "56px", md: "64px" },
                px: { xs: 2, md: 3 },
                color: "#65676b",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#f0f2f5",
                  color: "#1877f2",
                },
              },
              "& .Mui-selected": {
                color: "#1877f2 !important",
                backgroundColor: "rgba(24, 119, 242, 0.05)",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#1877f2",
                height: "3px",
                borderRadius: "2px 2px 0 0",
              },
              "& .MuiTabs-scrollButtons": {
                color: "#1877f2",
              },
            }}
          >
            <Tab
              icon={<PersonAdd sx={{ fontSize: "20px", mb: 0.5 }} />}
              label={`Friend Requests${friendRequests.length > 0 ? ` (${friendRequests.length})` : ""}`}
              iconPosition="start"
            />
            <Tab
              icon={<People sx={{ fontSize: "20px", mb: 0.5 }} />}
              label={`Your Friends${friends.length > 0 ? ` (${friends.length})` : ""}`}
              iconPosition="start"
            />
            <Tab icon={<Group sx={{ fontSize: "20px", mb: 0.5 }} />} label="Suggestions" iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ px: { xs: 2, md: 3 } }}>
            <FriendRequests />
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ px: { xs: 2, md: 3 } }}>
            <FriendsList />
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              textAlign: "center",
              py: { xs: 4, md: 6 },
            }}
          >
            <Box
              sx={{
                width: { xs: 80, md: 100 },
                height: { xs: 80, md: 100 },
                borderRadius: "50%",
                backgroundColor: "#f0f2f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <Group
                sx={{
                  fontSize: { xs: 40, md: 50 },
                  color: "#bcc0c4",
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "#1c1e21",
                mb: 1,
                fontWeight: 600,
                fontSize: { xs: "18px", md: "20px" },
              }}
            >
              People suggestions
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#65676b",
                fontSize: { xs: "14px", md: "16px" },
                maxWidth: "300px",
                mx: "auto",
              }}
            >
              Discover new people to connect with based on mutual friends and interests
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  )
}

export default FriendsPage
