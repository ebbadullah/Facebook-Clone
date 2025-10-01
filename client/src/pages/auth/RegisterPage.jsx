import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Box, TextField, Button, Typography, Alert, CircularProgress, Grid, MenuItem, Select, FormControl, IconButton, InputAdornment } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { toast } from "react-toastify"
import { registerUser, clearError } from "../../store/slices/authSlice"

const RegisterPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoading, error, registrationData } = useSelector((state) => state.auth)

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", username: "", email: "", password: "", confirmPassword: "", birthMonth: "", birthDay: "", birthYear: "", gender: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        if (registrationData && registrationData.user) {
            toast.success(`Welcome ${registrationData.user.username}! Your account has been created successfully.`)
            navigate("/")
        }
    }, [registrationData, navigate])

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

        if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password) {
            toast.error("Please fill in all required fields")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        const { confirmPassword, firstName, lastName, ...submitData } = formData
        const name = `${firstName} ${lastName}`
        dispatch(registerUser({ ...submitData, name }))
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const days = Array.from({ length: 31 }, (_, i) => i + 1)
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)

    return (
        <>
            <Box className="text-center" sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ color: "#1c1e21", fontWeight: 700, mb: 0.5, fontSize: { xs: "1.75rem", md: "2rem" } }}>
                    Create a New Account
                </Typography>
                <Typography variant="body1" sx={{ color: "#65676b", fontSize: { xs: "1rem", md: "1.1rem" } }}>
                    It's quick and easy.
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: "12px", backgroundColor: "rgba(244, 67, 54, 0.1)", border: "none", "& .MuiAlert-icon": { color: "#f44336" } }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Grid container spacing={2} sx={{ mb: 1.5 }}>
                    <Grid item xs={6}>
                        <TextField fullWidth name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: "16px", backgroundColor: "#f8f9fa", "& input": { padding: "16px 18px" }, "& fieldset": { borderColor: "#dddfe2", borderWidth: "1px" }, "&:hover fieldset": { borderColor: "#1877f2" }, "&.Mui-focused fieldset": { borderColor: "#1877f2", borderWidth: "2px", boxShadow: "0 0 0 3px rgba(24, 119, 242, 0.2)" } } }} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: "16px", backgroundColor: "#f8f9fa", "& input": { padding: "16px 18px" }, "& fieldset": { borderColor: "#dddfe2", borderWidth: "1px" }, "&:hover fieldset": { borderColor: "#1877f2" }, "&.Mui-focused fieldset": { borderColor: "#1877f2", borderWidth: "2px", boxShadow: "0 0 0 3px rgba(24, 119, 242, 0.2)" } } }} />
                    </Grid>
                </Grid>

                <TextField fullWidth name="username" placeholder="Username" value={formData.username} onChange={handleChange} variant="outlined" sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: "16px", backgroundColor: "#f8f9fa", "& input": { padding: "16px 18px" }, "& fieldset": { borderColor: "#dddfe2", borderWidth: "1px" }, "&:hover fieldset": { borderColor: "#1877f2" }, "&.Mui-focused fieldset": { borderColor: "#1877f2", borderWidth: "2px", boxShadow: "0 0 0 3px rgba(24, 119, 242, 0.2)" } } }} />

                <TextField fullWidth name="email" type="email" placeholder="Mobile number or email address" value={formData.email} onChange={handleChange} variant="outlined" sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: "16px", backgroundColor: "#f8f9fa", "& input": { padding: "16px 18px" }, "& fieldset": { borderColor: "#dddfe2", borderWidth: "1px" }, "&:hover fieldset": { borderColor: "#1877f2" }, "&.Mui-focused fieldset": { borderColor: "#1877f2", borderWidth: "2px", boxShadow: "0 0 0 3px rgba(24, 119, 242, 0.2)" } } }} />

                <TextField fullWidth name="password" type={showPassword ? "text" : "password"} placeholder="New password" value={formData.password} onChange={handleChange} variant="outlined" InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                {showPassword ? <VisibilityOff sx={{ color: "#65676b" }} /> : <Visibility sx={{ color: "#65676b" }} />}
                            </IconButton>
                        </InputAdornment>
                    )
                }} sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: "16px", backgroundColor: "#f8f9fa", "& input": { padding: "16px 18px" }, "& fieldset": { borderColor: "#dddfe2", borderWidth: "1px" }, "&:hover fieldset": { borderColor: "#1877f2" }, "&.Mui-focused fieldset": { borderColor: "#1877f2", borderWidth: "2px", boxShadow: "0 0 0 3px rgba(24, 119, 242, 0.2)" } } }} />

                <TextField fullWidth name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} variant="outlined" InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                                {showConfirmPassword ? <VisibilityOff sx={{ color: "#65676b" }} /> : <Visibility sx={{ color: "#65676b" }} />}
                            </IconButton>
                        </InputAdornment>
                    )
                }} sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: "16px", backgroundColor: "#f8f9fa", "& input": { padding: "16px 18px" }, "& fieldset": { borderColor: "#dddfe2", borderWidth: "1px" }, "&:hover fieldset": { borderColor: "#1877f2" }, "&.Mui-focused fieldset": { borderColor: "#1877f2", borderWidth: "2px", boxShadow: "0 0 0 3px rgba(24, 119, 242, 0.2)" } } }} />

                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: "#65676b", mb: 1, fontWeight: 600, fontSize: "13px" }}>Birthday</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <Select name="birthMonth" value={formData.birthMonth} onChange={handleChange} displayEmpty sx={{ borderRadius: "12px", fontSize: "16px", backgroundColor: "#f8f9fa", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dddfe2", borderWidth: "1px" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1877f2" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1877f2", borderWidth: "2px", boxShadow: "0 0 0 3px rgba(24, 119, 242, 0.2)" } }}>
                                    <MenuItem value="" disabled>Month</MenuItem>
                                    {months.map((month, index) => (
                                        <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <Select name="birthDay" value={formData.birthDay} onChange={handleChange} displayEmpty sx={{ borderRadius: "12px", fontSize: "16px", backgroundColor: "#f8f9fa", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dddfe2", borderWidth: "1px" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1877f2" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1877f2", borderWidth: "2px", boxShadow: "0 0 0 3px rgba(24, 119, 242, 0.2)" } }}>
                                    <MenuItem value="" disabled>Day</MenuItem>
                                    {days.map((day) => (
                                        <MenuItem key={day} value={day}>{day}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <Select name="birthYear" value={formData.birthYear} onChange={handleChange} displayEmpty sx={{ borderRadius: "12px", fontSize: "16px", backgroundColor: "#f8f9fa", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dddfe2", borderWidth: "1px" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1877f2" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1877f2", borderWidth: "2px", boxShadow: "0 0 0 3px rgba(24, 119, 242, 0.2)" } }}>
                                    <MenuItem value="" disabled>Year</MenuItem>
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: "#65676b", mb: 1, fontWeight: 600, fontSize: "13px" }}>Gender</Typography>
                    <Grid container spacing={1}>
                        {["female", "male", "custom"].map((gender) => (
                            <Grid item xs={4} key={gender}>
                                <Button fullWidth variant={formData.gender === gender ? "contained" : "outlined"} onClick={() => setFormData({ ...formData, gender })} sx={{ borderRadius: "12px", textTransform: "capitalize", fontSize: "14px", py: 1.5, backgroundColor: formData.gender === gender ? "#1877f2" : "#f8f9fa", borderColor: formData.gender === gender ? "#1877f2" : "#dddfe2", color: formData.gender === gender ? "white" : "#1c1e21", border: "1px solid", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", "&:hover": { backgroundColor: formData.gender === gender ? "#166fe5" : "#ffffff", borderColor: "#1877f2", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" } }}>
                                    {gender}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Typography variant="body2" sx={{ color: "#65676b", fontSize: "12px", lineHeight: 1.4, mt: 2, mb: 1.5 }}>
                    By clicking Sign Up, you agree to our{" "}
                    <Link to="/terms" style={{ color: "#1877f2", textDecoration: "none", fontWeight: 500 }}>Terms</Link>,{" "}
                    <Link to="/privacy" style={{ color: "#1877f2", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</Link> and{" "}
                    <Link to="/cookies" style={{ color: "#1877f2", textDecoration: "none", fontWeight: 500 }}>Cookies Policy</Link>
                    . You may receive SMS notifications from us and can opt out at any time.
                </Typography>

                <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ mb: 1.5, backgroundColor: "#00a400", py: 1.8, fontSize: "18px", fontWeight: "bold", textTransform: "none", borderRadius: "12px", boxShadow: "0 8px 25px rgba(0, 164, 0, 0.3)", transition: "all 0.3s ease", "&:hover": { backgroundColor: "#42b883", boxShadow: "0 12px 35px rgba(0, 164, 0, 0.4)", transform: "translateY(-2px)" }, "&:disabled": { backgroundColor: "#e4e6ea", color: "#bcc0c4" } }}>
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                </Button>
            </form>

            <Box className="text-center" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: "#65676b", fontSize: "14px" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#1877f2", textDecoration: "none", fontWeight: 600 }}>Log In</Link>
                </Typography>
            </Box>
        </>
    )
}

export default RegisterPage