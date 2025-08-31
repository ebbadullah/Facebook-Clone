import { Box, Container, Paper, Typography } from "@mui/material"

const AuthLayout = ({ children }) => {
    return (
        <Box sx={{ minHeight: "100vh", background: "#f0f2f5", backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23e4e6ea' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", py: { xs: 2, md: 3 } }}>
            {/* Decorative Elements */}
            <Box sx={{ position: "absolute", top: -50, left: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(24, 119, 242, 0.1)", animation: "float 6s ease-in-out infinite" }} />
            <Box sx={{ position: "absolute", bottom: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "rgba(66, 184, 131, 0.1)", animation: "float 8s ease-in-out infinite reverse" }} />

            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: "center", gap: { xs: 4, md: 8 } }}>
                    {/* Left Section - Image and Text */}
                    <Box sx={{ flex: 1, display: { xs: "none", md: "flex" }, flexDirection: "column", alignItems: "flex-start", justifyContent: "center", maxWidth: "500px", textAlign: "left", pr: 4 }}>
                        <img src="/placeholder.svg?height=300&width=400" alt="Connect with friends" style={{ maxWidth: "100%", height: "auto", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", marginBottom: "24px" }} />
                        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#1877f2", fontSize: "3.5rem", letterSpacing: "-2px", mb: 2 }}>facebook</Typography>
                        <Typography variant="h5" sx={{ color: "#1c1e21", fontWeight: 600, mb: 1, fontSize: "1.75rem" }}>Connect with friends and the world around you on Facebook.</Typography>
                        <Typography variant="body1" sx={{ color: "#65676b", fontSize: "1.1rem" }}>Facebook helps you connect and share with the people in your life.</Typography>
                    </Box>

                    {/* Right Section - Form (children will be rendered here) */}
                    <Paper elevation={8} sx={{ padding: { xs: 2, md: 3 }, borderRadius: "16px", background: "rgba(255, 255, 255, 0.98)", backdropFilter: "blur(10px)", border: "1px solid rgba(228, 230, 234, 0.3)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)", width: { xs: "100%", sm: "500px" }, flexShrink: 0, ml: { md: "auto" }, mr: { md: 0 } }}>
                        {children}
                    </Paper>
                </Box>
            </Container>

            <style jsx global>{`@keyframes float {0%,100% {transform: translateY(0px);}50% {transform: translateY(-20px);}}`}</style>
        </Box>
    )
}

export default AuthLayout