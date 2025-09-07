import { useState } from "react"
import { useNavigate } from "react-router-dom"
import HomeIcon from '@mui/icons-material/Home'
import TheatersIcon from '@mui/icons-material/Theaters'
import LiveTvIcon from '@mui/icons-material/LiveTv'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import ArticleIcon from '@mui/icons-material/Article'
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy'
import SearchIcon from '@mui/icons-material/Search'

const VideoSidebar = ({ onSearch }) => {
    const [searchInput, setSearchInput] = useState("")
    const navigate = useNavigate()

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        onSearch(searchInput)
    }

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value)
        onSearch(e.target.value)
    }

    const navigationItems = [
        { name: "Home", icon: <HomeIcon />, path: "/" },
        { name: "Reels", icon: <TheatersIcon />, path: "/video" },
        { name: "Live", icon: <LiveTvIcon />, path: "/video" },
        { name: "Gaming", icon: <SportsEsportsIcon />, path: "/video" },
        { name: "Sports", icon: <SportsSoccerIcon />, path: "/video" },
        { name: "Music", icon: <MusicNoteIcon />, path: "/video" },
        { name: "News", icon: <ArticleIcon />, path: "/video" },
        { name: "Entertainment", icon: <TheaterComedyIcon />, path: "/entertainment" },
    ]

    return (
        <div className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 shadow-sm z-10 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Videos</h1>
                <form onSubmit={handleSearchSubmit} className="relative">
                    <input type="text" placeholder="Search videos..." value={searchInput} onChange={handleSearchChange} className="w-full px-4 py-3 pl-12 bg-gray-100 rounded-full border-none outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200" />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <SearchIcon className="w-5 h-5" />
                    </div>
                    <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </form>
            </div>
   
            <div className="p-4">
                <nav className="space-y-2">
                    {navigationItems.map((item) => (
                        <button key={item.name} onClick={() => navigate(item.path)} className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-blue-50 transition-colors duration-200 group">
                            <span className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200">{item.icon}</span>
                            <span className="text-gray-700 font-medium group-hover:text-gray-900">{item.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-8 p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">© 2024 Video Platform. All rights reserved.</p>
            </div>
        </div>
    )
}

export default VideoSidebar