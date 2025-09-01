import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { 
    Box, 
    Typography, 
    Tabs, 
    Tab, 
    Paper,
    Container,
    Grid
} from "@mui/material"
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
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    )

    return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#1c1e21", mb: 1 }}>
                    Friends
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your friends and friend requests
                </Typography>
            </Box>

            <Paper sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs 
                        value={activeTab} 
                        onChange={handleTabChange} 
                        aria-label="friends tabs"
                        sx={{
                            "& .MuiTab-root": {
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: "16px",
                                minHeight: "64px",
                                px: 3
                            },
                            "& .Mui-selected": {
                                color: "#1877f2"
                            },
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#1877f2",
                                height: "3px"
                            }
                        }}
                    >
                        <Tab 
                            icon={<PersonAdd sx={{ fontSize: "20px", mb: 0.5 }} />} 
                            label={`Friend Requests (${friendRequests.length})`} 
                            iconPosition="start"
                        />
                        <Tab 
                            icon={<People sx={{ fontSize: "20px", mb: 0.5 }} />} 
                            label={`Your Friends (${friends.length})`} 
                            iconPosition="start"
                        />
                        <Tab 
                            icon={<Group sx={{ fontSize: "20px", mb: 0.5 }} />} 
                            label="Suggestions" 
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                <TabPanel value={activeTab} index={0}>
                    <Box sx={{ px: 3 }}>
                        <FriendRequests />
                    </Box>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                    <Box sx={{ px: 3 }}>
                        <FriendsList />
                    </Box>
                </TabPanel>

                <TabPanel value={activeTab} index={2}>
                    <Box sx={{ px: 3, textAlign: "center" }}>
                        <Group sx={{ fontSize: 64, color: "#e0e0e0", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            People suggestions
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Discover new people to connect with
                        </Typography>
                    </Box>
                </TabPanel>
            </Paper>
        </Container>
    )
}

export default FriendsPage
