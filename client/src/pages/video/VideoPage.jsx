import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllPosts } from "../../store/slices/postSlice"
import VideoSidebar from "../../components/common/VideoSidebar"
import Video from "../../components/feed/Video"

const VideoPage = () => {
    const dispatch = useDispatch()
    const { posts, isLoading } = useSelector((state) => state.posts)
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredVideos, setFilteredVideos] = useState([])

    useEffect(() => {
        dispatch(getAllPosts())
    }, [dispatch])

    useEffect(() => {
        const videosPosts = posts.filter((post) => {
            const hasVideoMedia = post.media && post.media.some((m) => m.type === "video")
            const hasVideoUrl = post.media_url && /\.(mp4|webm|ogg|mov|avi)(\?|$)/i.test(post.media_url)
            return hasVideoMedia || hasVideoUrl
        })

        if (searchQuery.trim()) {
            const filtered = videosPosts.filter(
                (video) =>
                    video.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    video.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            setFilteredVideos(filtered)
        } else {
            setFilteredVideos(videosPosts)
        }
    }, [posts, searchQuery])

    const handleSearch = (query) => {
        setSearchQuery(query)
    }

    return (
        <div className="flex w-full min-h-screen bg-gray-100">
            <VideoSidebar onSearch={handleSearch} />
            <div className="flex-1 p-4 md:p-6 w-full">
                <div className="w-full">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredVideos.length > 0 ? (
                        <div className="space-y-6 md:space-y-8">
                            {filteredVideos.map((video) => (
                                <Video key={video._id} video={video} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg">
                                {searchQuery ? "No videos found matching your search." : "No videos available."}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VideoPage