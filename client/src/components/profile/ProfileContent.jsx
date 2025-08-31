"use client"

import { useState } from "react"
import { Box, Tabs, Tab } from "@mui/material"
import PostsTab from "./PostsTab"
import PhotosTab from "./PhotosTab"
import VideosTab from "./VideosTab"

const ProfileContent = ({ user, isOwnProfile, userPosts, userPhotos, userVideos, userShared, onEditDialog }) => {
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "white",
                    borderRadius: { xs: 0, sm: "8px" },
                    boxShadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
                    mb: { xs: 1, sm: 2 },
                }}
            >
                <Box sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{
                            "& .MuiTab-root": {
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: { xs: "14px", sm: "16px" },
                                color: "#65676b",
                                minWidth: { xs: "auto", sm: 120 },
                                px: { xs: 1, sm: 2 },
                                "&.Mui-selected": {
                                    color: "#1877f2",
                                },
                            },
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#1877f2",
                                height: "3px",
                                borderRadius: "2px",
                            },
                            "& .MuiTabs-flexContainer": {
                                borderBottom: "1px solid #dadde1",
                            },
                        }}
                    >
                        <Tab label="Posts" />
                        <Tab label="Photos" />
                        <Tab label="Videos" />
                    </Tabs>
                </Box>
            </Box>

            {/* Tab Content */}
            <Box sx={{ width: "100%" }}>
                {tabValue === 0 && (
                    <PostsTab
                        user={user}
                        isOwnProfile={isOwnProfile}
                        userPosts={userPosts}
                        userPhotos={userPhotos}
                        onEditDialog={onEditDialog}
                        setTabValue={setTabValue}
                    />
                )}

                {tabValue === 1 && <PhotosTab userPhotos={userPhotos} user={user} />}

                {tabValue === 2 && <VideosTab userVideos={userVideos || []} user={user} />}
            </Box>
        </>
    )
}

export default ProfileContent
