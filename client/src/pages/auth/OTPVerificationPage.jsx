import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Box, TextField, Button, Typography, Alert, CircularProgress, Paper } from "@mui/material"
import { toast } from "react-toastify"
import { verifyOTP, clearError } from "../../store/slices/authSlice"

const OTPVerificationPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoading, error, registrationData, isAuthenticated } = useSelector((state) => state.auth)

    const [otp, setOtp] = useState("")

    useEffect(() => {
        if (!registrationData) {
            navigate("/register")
        }
    }, [registrationData, navigate])

    useEffect(() => {
        if (isAuthenticated) {
            toast.success("Account verified successfully!")
            navigate("/")
        }
    }, [isAuthenticated, navigate])

    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch(clearError())
        }
    }, [error, dispatch])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!otp || otp.length !== 4) {
            toast.error("Please enter a valid 4-digit OTP")
            return
        }
        dispatch(verifyOTP({ userId: registrationData.userId, otp: otp }))
    }

    return (
        <Box className="min-h-screen bg-facebookGray flex items-center justify-center p-4">
            <Paper className="p-6 rounded-lg shadow-lg w-full max-w-md bg-white">
                <Box className="text-center mb-4">
                    <Typography variant="h3" className="font-bold text-facebookBlue mb-2 text-5xl">facebook</Typography>
                    <Typography variant="h5" className="text-facebookDarkText font-semibold mb-1 text-2xl">Verify Your Email</Typography>
                    <Typography variant="body1" className="text-facebookTextGray mb-2 text-lg">We've sent a 4-digit verification code to your email address.</Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField fullWidth name="otp" placeholder="Enter 4-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} inputProps={{ maxLength: 4, style: { textAlign: "center", fontSize: "28px", letterSpacing: "12px" } }} sx={{ mb: 3 }} className="fb-input" variant="outlined" />

                    <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ backgroundColor: "facebookGreen", py: 1.5, fontSize: "17px", fontWeight: 600, textTransform: "none", mb: 2, "&:hover": { backgroundColor: "#369870" } }} className="fb-button">
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Verify Account"}
                    </Button>
                </form>

                <Box className="text-center">
                    <Typography variant="body2" className="text-facebookTextGray text-base">Didn't receive the code?{" "}
                        <Button variant="text" sx={{ color: "facebookBlue", textTransform: "none", fontWeight: 600, p: 0, minWidth: "auto", fontSize: "1rem" }} className="hover:underline">Resend</Button>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    )
}

export default OTPVerificationPage