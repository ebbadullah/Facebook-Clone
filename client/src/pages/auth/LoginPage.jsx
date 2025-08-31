import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Box, TextField, Button, Typography, Alert, CircularProgress, Divider, IconButton, InputAdornment, Grid } from "@mui/material"
import { Visibility, VisibilityOff, Google, Apple } from "@mui/icons-material"
import { toast } from "react-toastify"
import { loginUser, clearError } from "../../store/slices/authSlice"

const LoginPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth)

    const [formData, setFormData] = useState({ email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/")
        }
    }, [isAuthenticated, navigate])

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearError())
        }
    }, [error, dispatch])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields")
            return
        }
        dispatch(loginUser(formData))
    }

    return (
        <>
            <Box className="text-center" sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ color: "#1c1e21", fontWeight: 700, mb: 0.5, fontSize: { xs: "1.5rem", md: "1.75rem" } }}>Log in to Facebook</Typography>
                <Typography variant="body1" sx={{ color: "#65676b", fontSize: { xs: "0.95rem", md: "1rem" } }}>Connect with friends and the world around you.</Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: "12px", backgroundColor: "rgba(244, 67, 54, 0.1)", border: "none", "& .MuiAlert-icon": { color: "#f44336" } }}>{error}</Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField fullWidth name="email" type="email" placeholder="Email address or phone number" value={formData.email} onChange={handleChange} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: "16px", backgroundColor: "#f8f9fa", "& input": { padding: "16px 18px" }, "& fieldset": { borderColor: "#dddfe2", borderWidth: "1px" }, "&:hover fieldset": { borderColor: "#1877f2" }, "&.Mui-focused fieldset": { borderColor: "#1877f2", borderWidth: "2px", boxShadow: "0 0 0 3px rgba(24, 119, 242, 0.2)" } } }} />

                <TextField fullWidth name="password" type={showPassword ? "text" : "password"} placeholder="Password" value={formData.password} onChange={handleChange} variant="outlined" InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                {showPassword ? <VisibilityOff sx={{ color: "#65676b" }} /> : <Visibility sx={{ color: "#65676b" }} />}
                            </IconButton>
                        </InputAdornment>
                    )
                }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: "16px", backgroundColor: "#f8f9fa", "& input": { padding: "16px 18px" }, "& fieldset": { borderColor: "#dddfe2", borderWidth: "1px" }, "&:hover fieldset": { borderColor: "#1877f2" }, "&.Mui-focused fieldset": { borderColor: "#1877f2", borderWidth: "2px", boxShadow: "0 0 0 3px rgba(24, 119, 242, 0.2)" } } }} />

                <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ background: "linear-gradient(45deg, #1877f2, #42a5f5)", py: 2, fontSize: "18px", fontWeight: "bold", textTransform: "none", borderRadius: "12px", boxShadow: "0 8px 25px rgba(24, 119, 242, 0.3)", transition: "all 0.3s ease", "&:hover": { background: "linear-gradient(45deg, #166fe5, #1976d2)", boxShadow: "0 12px 35px rgba(24, 119, 242, 0.4)", transform: "translateY(-2px)" }, "&:disabled": { background: "#e4e6ea", boxShadow: "none", color: "#bcc0c4" }, mb: 2 }}>
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Log In"}
                </Button>
            </form>

            <Box className="text-center mt-2">
                <Link to="/forgot-password" style={{ textDecoration: "none", fontSize: "15px", color: "#1877f2", fontWeight: 500, transition: "color 0.2s ease", "&:hover": { textDecoration: "underline" } }}>Forgotten password?</Link>
            </Box>

            <Divider sx={{ my: 2.5 }}>
                <Typography variant="body2" sx={{ color: "#65676b", px: 2, fontSize: "14px" }}>or</Typography>
            </Divider>

            {/* Social Login */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                    <Button fullWidth variant="outlined" startIcon={<Google sx={{ fontSize: "20px" }} />} sx={{ py: 1.5, fontSize: "14px", fontWeight: 600, textTransform: "none", borderRadius: "10px", borderColor: "#dadce0", color: "#3c4043", border: "1px solid #dadce0", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", "&:hover": { backgroundColor: "#f8f9fa", borderColor: "#c5c7cb", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" } }}>Google</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button fullWidth variant="outlined" startIcon={<Apple sx={{ fontSize: "20px" }} />} sx={{ py: 1.5, fontSize: "14px", fontWeight: 600, textTransform: "none", borderRadius: "10px", borderColor: "#dadce0", color: "#3c4043", border: "1px solid #dadce0", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", "&:hover": { backgroundColor: "#f8f9fa", borderColor: "#c5c7cb", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" } }}>Apple</Button>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2.5 }} />

            <Box className="text-center">
                <Button component={Link} to="/register" variant="contained" sx={{ backgroundColor: "#42b883", py: 1.5, px: 4, fontSize: "17px", fontWeight: "bold", textTransform: "none", borderRadius: "12px", boxShadow: "0 8px 25px rgba(66, 184, 131, 极速加速器", transition: "all 0.3s ease", "&:hover": { backgroundColor: "#369870", boxShadow: "0 12px 35px rgba(66, 184, 131, 0.4)", transform: "translateY(-2px)" } }}>Create New Account</Button>
            </Box>

            <Box className="text-center" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: "#65676b", fontSize: "13px" }}><strong>Create a Page</strong> for a celebrity, brand or business.</Typography>
            </Box>
        </>
    )
}

export default LoginPage