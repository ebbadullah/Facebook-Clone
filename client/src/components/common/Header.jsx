import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AppBar, Toolbar, Box, IconButton, Avatar, Menu, MenuItem, Badge, InputBase, Typography, Divider, Drawer } from "@mui/material"
import { Home, People, OndemandVideo, Storefront, SportsEsports, Search, Message, ArrowDropDown, Settings, HelpOutline, Logout, Menu as MenuIcon } from "@mui/icons-material"
import { logoutUser } from "../../store/slices/authSlice"
import NotificationDropdown from "./NotificationDropdown"

const Header = ({ onMobileMenuToggle }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const [anchorEl, setAnchorEl] = useState(null)
    const [activeTab, setActiveTab] = useState(0)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        dispatch(logoutUser())
        handleMenuClose()
    }

    const handleProfile = () => {
        navigate("/profile")
        handleMenuClose()
    }

    const navigationItems = [
        { icon: Home, label: "Home" },
        { icon: People, label: "Friends" },
        { icon: OndemandVideo, label: "Watch" },
        { icon: Storefront, label: "Marketplace" },
        { icon: SportsEsports, label: "Gaming" },
    ]

    return (
        <>
            <AppBar position="fixed" elevation={0} sx={{ backgroundColor: "white", borderBottom: "1px solid #e4e6ea", zIndex: 1100 }}>
                <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, md: 2 }, minHeight: "56px" }}>
                    {/* Left Section - Logo and Search */}
                    <Box sx={{ display: "flex", alignItems: "center", flex: { xs: 1, md: 1 } }}>
                        <IconButton sx={{ display: { xs: "flex", lg: "none" }, mr: 1, color: "#1c1e21" }} onClick={onMobileMenuToggle}><MenuIcon /></IconButton>

                        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1877f2", cursor: "pointer", mr: { xs: 1, md: 2 }, fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" } }} onClick={() => navigate("/")}>facebook</Typography>

                        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", backgroundColor: "#f0f2f5", borderRadius: "50px", px: 2, py: 1, ml: 2, width: { md: "200px", lg: "240px" }, transition: "all 0.2s ease", "&:hover": { backgroundColor: "#e4e6ea" } }}>
                            <Search sx={{ color: "#65676b", mr: 1, fontSize: "20px" }} />
                            <InputBase placeholder="Search Facebook" sx={{ flex: 1, color: "#1c1e21", fontSize: "15px", "& input::placeholder": { color: "#65676b", opacity: 1 } }} />
                        </Box>
                    </Box>

                    {/* Center Section - Navigation */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center", flex: 1, maxWidth: "600px" }}>
                        {navigationItems.map((item, index) => (
                            <IconButton key={index} onClick={() => setActiveTab(index)} sx={{ mx: 0.5, px: { md: 2, lg: 4 }, py: 1.5, borderRadius: "8px", color: activeTab === index ? "#1877f2" : "#65676b", position: "relative", transition: "all 0.2s ease", "&:hover": { backgroundColor: "#f0f2f5", color: "#1877f2" }, "&::after": { content: '""', position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", backgroundColor: activeTab === index ? "#1877f2" : "transparent", borderRadius: "3px 3px 0 0", transition: "background-color 0.2s ease" } }}>
                                <item.icon sx={{ fontSize: { md: "20px", lg: "24px" } }} />
                            </IconButton>
                        ))}
                    </Box>

                    {/* Right Section - User Actions */}
                    <Box sx={{ display: "flex", alignItems: "center", flex: { xs: 0, md: 1 }, justifyContent: "flex-end", gap: { xs: 0.5, sm: 1 } }}>
                        <IconButton sx={{ display: { xs: "flex", md: "none" }, backgroundColor: "#f0f2f5", width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, "&:hover": { backgroundColor: "#e4e6ea" } }} onClick={() => setMobileSearchOpen(true)}><Search sx={{ color: "#1c1e21", fontSize: "20px" }} /></IconButton>

                        {/* Messages */}
                        <IconButton sx={{ backgroundColor: "#f0f2f5", width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, transition: "all 0.2s ease", "&:hover": { backgroundColor: "#e4e6ea", transform: "scale(1.05)" } }}>
                            <Badge badgeContent={3} color="error" sx={{ "& .MuiBadge-badge": { fontSize: "11px", height: "18px", minWidth: "18px" } }}><Message sx={{ color: "#1c1e21", fontSize: "20px" }} /></Badge>
                        </IconButton>

                        {/* Notifications */}
                        <NotificationDropdown />

                        {/* User Menu */}
                        <IconButton onClick={handleMenuOpen} sx={{ ml: 0.5, p: 0.5, borderRadius: "50px", transition: "all 0.2s ease", "&:hover": { backgroundColor: "#f0f2f5" } }}>
                            <Avatar src={user?.ProfilePicture} sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, border: activeTab !== null ? "2px solid #1877f2" : "2px solid transparent", transition: "border-color 0.2s ease" }}>{user?.name?.charAt(0)}</Avatar>
                            <ArrowDropDown sx={{ color: "#1c1e21", ml: 0.5, fontSize: "20px", display: { xs: "none", sm: "block" } }} />
                        </IconButton>

                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { mt: 1, minWidth: { xs: 260, sm: 280 }, borderRadius: "8px", boxShadow: "0 8px 16px rgba(0,0,0,0.15)", border: "1px solid #e4e6ea", "& .MuiMenuItem-root": { px: 2, py: 1.5, borderRadius: "6px", mx: 1, my: 0.5, transition: "background-color 0.2s ease", "&:hover": { backgroundColor: "#f0f2f5" } } } }}>
                            <MenuItem onClick={handleProfile}>
                                <Avatar src={user?.ProfilePicture} sx={{ width: 36, height: 36, mr: 2 }}>{user?.name?.charAt(0)}</Avatar>
                                <Box>
                                    <Typography sx={{ fontWeight: 600, fontSize: "15px", color: "#1c1e21" }}>{user?.name}</Typography>
                                    <Typography sx={{ fontSize: "13px", color: "#65676b" }}>See your profile</Typography>
                                </Box>
                            </MenuItem>

                            <Divider sx={{ my: 1, mx: 1 }} />

                            <MenuItem onClick={handleMenuClose}>
                                <Settings sx={{ mr: 2, color: "#65676b" }} />
                                <Typography sx={{ fontSize: "15px", color: "#1c1e21" }}>Settings & Privacy</Typography>
                            </MenuItem>

                            <MenuItem onClick={handleMenuClose}>
                                <HelpOutline sx={{ mr: 2, color: "#65676b" }} />
                                <Typography sx={{ fontSize: "15px", color: "#1c1e21" }}>Help & Support</Typography>
                            </MenuItem>

                            <Divider sx={{ my: 1, mx: 1 }} />

                            <MenuItem onClick={handleLogout}>
                                <Logout sx={{ mr: 2, color: "#65676b" }} />
                                <Typography sx={{ fontSize: "15px", color: "#1c1e21" }}>Log Out</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer anchor="top" open={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} PaperProps={{ sx: { backgroundColor: "white", borderBottom: "1px solid #e4e6ea", boxShadow: "none" } }}>
                <Box sx={{ p: 2, pt: 8 }}>
                    <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "#f0f2f5", borderRadius: "50px", px: 2, py: 1.5 }}>
                        <Search sx={{ color: "#65676b", mr: 1, fontSize: "20px" }} />
                        <InputBase placeholder="Search Facebook" autoFocus sx={{ flex: 1, color: "#1c1e21", fontSize: "16px", "& input::placeholder": { color: "#65676b", opacity: 1 } }} />
                    </Box>
                </Box>
            </Drawer>
        </>
    )
}

export default Header