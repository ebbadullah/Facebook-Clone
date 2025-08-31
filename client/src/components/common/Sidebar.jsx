import { Box, List, ListItem, ListItemIcon, ListItemText, Avatar, Divider, Collapse, Typography } from "@mui/material"
import { useState } from "react"
import { useSelector } from "react-redux"
import { People, Bookmark, Schedule, Flag, Storefront, OndemandVideo, SportsEsports, ExpandMore, ExpandLess, Group, Event, Newspaper } from "@mui/icons-material"

const Sidebar = ({ onItemClick }) => {
    const { user } = useSelector((state) => state.auth)
    const [showMore, setShowMore] = useState(false)

    const mainMenuItems = [
        { icon: <Avatar src={user?.ProfilePicture} sx={{ width: 32, height: 32 }}>{user?.name?.charAt(0)}</Avatar>, text: user?.name || "User", primary: true },
        { icon: <People sx={{ color: "#1877f2" }} />, text: "Friends", color: "#1877f2" },
        { icon: <Schedule sx={{ color: "#f02849" }} />, text: "Memories", color: "#f02849" },
        { icon: <Bookmark sx={{ color: "#7c3aed" }} />, text: "Saved", color: "#7c3aed" },
        { icon: <Flag sx={{ color: "#f59e0b" }} />, text: "Pages", color: "#f59e0b" },
        { icon: <OndemandVideo sx={{ color: "#1877f2" }} />, text: "Video", color: "#1877f2" },
    ]

    const moreMenuItems = [
        { icon: <Storefront sx={{ color: "#42b883" }} />, text: "Marketplace", color: "#42b883" },
        { icon: <SportsEsports sx={{ color: "#8b5cf6" }} />, text: "Gaming", color: "#8b5cf6" },
        { icon: <Group sx={{ color: "#1877f2" }} />, text: "Groups", color: "#1877f2" },
        { icon: <Event sx={{ color: "#f59e0b" }} />, text: "Events", color: "#f59e0b" },
        { icon: <Newspaper sx={{ color: "#65676b" }} />, text: "News", color: "#65676b" },
    ]

    const shortcuts = [
        { name: "React Developers", image: "/placeholder.svg?height=32&width=32" },
        { name: "JavaScript Community", image: "/placeholder.svg?height=32&width=32" },
        { name: "Web Development", image: "/placeholder.svg?height=32&width=32" },
    ]

    const handleItemClick = () => {
        if (onItemClick) {
            onItemClick()
        }
    }

    return (
        <Box sx={{ width: "100%", height: "100%", backgroundColor: "white", overflowY: "auto", "&::-webkit-scrollbar": { width: "8px" }, "&::-webkit-scrollbar-track": { background: "#f1f1f1" }, "&::-webkit-scrollbar-thumb": { background: "#c1c1c1", borderRadius: "4px" } }}>
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
                <List sx={{ p: 0 }}>
                    {mainMenuItems.map((item, index) => (
                        <ListItem key={index} onClick={handleItemClick} sx={{ borderRadius: "8px", mb: 0.5, cursor: "pointer", px: { xs: 1, sm: 2 }, py: 1.5, transition: "background-color 0.2s ease", "&:hover": { backgroundColor: "#f0f2f5" } }}>
                            <ListItemIcon sx={{ minWidth: { xs: 40, sm: 48 } }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} sx={{ "& .MuiListItemText-primary": { fontWeight: item.primary ? 600 : 500, fontSize: { xs: "14px", sm: "15px" }, color: "#1c1e21" } }} />
                        </ListItem>
                    ))}

                    <Collapse in={showMore} timeout="auto" unmountOnExit>
                        {moreMenuItems.map((item, index) => (
                            <ListItem key={index} onClick={handleItemClick} sx={{ borderRadius: "8px", mb: 0.5, cursor: "pointer", px: { xs: 1, sm: 2 }, py: 1.5, transition: "background-color 0.2s ease", "&:hover": { backgroundColor: "#f0f2f5" } }}>
                                <ListItemIcon sx={{ minWidth: { xs: 40, sm: 48 } }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} sx={{ "& .MuiListItemText-primary": { fontWeight: 500, fontSize: { xs: "14px", sm: "15px" }, color: "#1c1e21" } }} />
                            </ListItem>
                        ))}
                    </Collapse>

                    <ListItem onClick={() => setShowMore(!showMore)} sx={{ borderRadius: "8px", cursor: "pointer", px: { xs: 1, sm: 2 }, py: 1.5, transition: "background-color 0.2s ease", "&:hover": { backgroundColor: "#f0f2f5" } }}>
                        <ListItemIcon sx={{ minWidth: { xs: 40, sm: 48 } }}>
                            <Box sx={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#e4e6ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {showMore ? <ExpandLess sx={{ color: "#65676b", fontSize: "20px" }} /> : <ExpandMore sx={{ color: "#65676b", fontSize: "20px" }} />}
                            </Box>
                        </ListItemIcon>
                        <ListItemText primary={showMore ? "See less" : "See more"} sx={{ "& .MuiListItemText-primary": { fontWeight: 500, fontSize: { xs: "14px", sm: "15px" }, color: "#65676b" } }} />
                    </ListItem>
                </List>

                <Divider sx={{ my: 2, backgroundColor: "#e4e6ea" }} />

                {/* Shortcuts Section */}
                <Box sx={{ px: { xs: 1, sm: 2 } }}>
                    <Typography sx={{ fontSize: { xs: "16px", sm: "17px" }, fontWeight: 600, color: "#65676b", mb: 2 }}>Your shortcuts</Typography>

                    <List sx={{ p: 0 }}>
                        {shortcuts.map((shortcut, index) => (
                            <ListItem key={index} onClick={handleItemClick} sx={{ borderRadius: "8px", mb: 0.5, cursor: "pointer", px: 1, py: 1, transition: "background-color 0.2s ease", "&:hover": { backgroundColor: "#f0f2f5" } }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <Avatar src={shortcut.image} sx={{ width: 28, height: 28 }}>{shortcut.name.charAt(0)}</Avatar>
                                </ListItemIcon>
                                <ListItemText primary={shortcut.name} sx={{ "& .MuiListItemText-primary": { fontWeight: 500, fontSize: { xs: "13px", sm: "14px" }, color: "#1c1e21" } }} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </Box>
    )
}

export default Sidebar