import { Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import OTPVerificationPage from "../pages/auth/OTPVerificationPage"
import HomePage from "../pages/home/HomePage"
import ProfilePage from "../pages/profile/ProfilePage"
import FriendsPage from "../pages/friends/FriendsPage"
import MainLayout from "../components/layout/MainLayout"
import AuthLayout from "../components/layout/AuthLayout"

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth)
    return isAuthenticated ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth)
    return !isAuthenticated ? children : <Navigate to="/" />
}

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={
                <PublicRoute>
                    <AuthLayout><LoginPage /></AuthLayout>
                </PublicRoute>
            } />

            <Route path="/register" element={
                <PublicRoute>
                    <AuthLayout><RegisterPage /></AuthLayout>
                </PublicRoute>
            } />

            <Route path="/verify-otp" element={
                <PublicRoute>
                    <AuthLayout><OTPVerificationPage /></AuthLayout>
                </PublicRoute>
            } />

            <Route path="/" element={
                <ProtectedRoute>
                    <MainLayout><HomePage /></MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/profile/:userId?" element={
                <ProtectedRoute>
                    <MainLayout><ProfilePage /></MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/friends" element={
                <ProtectedRoute>
                    <MainLayout><FriendsPage /></MainLayout>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default AppRoutes