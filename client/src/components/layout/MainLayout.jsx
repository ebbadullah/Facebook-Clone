import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"

import Header from "../common/Header"
import Sidebar from "../common/Sidebar"
import RightSidebar from "../common/RightSidebar"
import { getCurrentUser } from "../../store/slices/userSlice"

const MainLayout = ({ children }) => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()

    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const isTablet = useMediaQuery(theme.breakpoints.down("lg"))

    // Profile page check
    const isProfilePage = location.pathname.includes("/profile") || location.pathname.includes("/user")

    useEffect(() => {
        dispatch(getCurrentUser())
    }, [dispatch])

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    const handleMobileMenuClose = () => {
        setMobileMenuOpen(false)
    }

    return (
        <Box sx={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
            <Header onMobileMenuToggle={handleMobileMenuToggle} />

            <Box sx={{ display: "flex", pt: "56px" }}>
                {!isProfilePage && (
                    <>
                        {isMobile ? (
                            <Drawer anchor="left" open={mobileMenuOpen} onClose={handleMobileMenuClose} PaperProps={{ sx: { width: 280, backgroundColor: "white", borderRight: "1px solid #e4e6ea" } }}>
                                <Box sx={{ pt: "56px" }}><Sidebar onItemClick={handleMobileMenuClose} navigate={navigate} /></Box>
                            </Drawer>
                        ) : (
                            <Box sx={{ width: { md: 280, lg: 360 }, position: "fixed", height: "calc(100vh - 56px)", overflowY: "auto", display: { xs: "none", md: "block" } }}>
                                <Sidebar navigate={navigate} />
                            </Box>
                        )}
                    </>
                )}

                <Box sx={{ flex: 1, ml: isProfilePage ? 0 : { xs: 0, md: "280px", lg: "360px" }, mr: isProfilePage ? 0 : { xs: 0, lg: "320px" }, p: { xs: 1, sm: 2 }, maxWidth: "100%" }}>
                    {children}
                </Box>

                {!isProfilePage && (
                    <Box sx={{ width: "320px", position: "fixed", right: 0, height: "calc(100vh - 56px)", overflowY: "auto", display: { xs: "none", lg: "block" } }}>
                        <RightSidebar navigate={navigate} />
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default MainLayout