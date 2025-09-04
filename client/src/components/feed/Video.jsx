import { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { likePost, commentOnPost } from "../../store/slices/postSlice"
import VideoJSPlayer from "../../Plugins/VideoJs/Index"

const Video = ({ video }) => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const [showComments, setShowComments] = useState(false)
    const [comment, setComment] = useState("")
    const [isLiking, setIsLiking] = useState(false)
    const videoPlayerRef = useRef(null)

    const getVideoUrl = () => {
        if (video.media && video.media.length > 0) {
            const videoMedia = video.media.find((m) => m.type === "video")
            return videoMedia?.url
        }
        return video.media_url
    }

    const getPosterUrl = () => {
        if (video.media && video.media.length > 0) {
            const videoMedia = video.media.find((m) => m.type === "video")
            return videoMedia?.poster
        }
        return video.media_poster
    }

    const handleLike = async () => {
        if (isLiking) return

        if (videoPlayerRef.current) {
            const player = videoPlayerRef.current.getPlayer()
            const wasPlaying = !player.paused()
            setIsLiking(true)
            try {
                await dispatch(likePost(video._id)).unwrap()
                if (wasPlaying) {
                    player.play().catch(() => { })
                }
            } catch (error) {
                console.error("Like error:", error)
            } finally {
                setIsLiking(false)
            }
        } else {
            setIsLiking(true)
            try {
                await dispatch(likePost(video._id)).unwrap()
            } catch (error) {
                console.error("Like error:", error)
            } finally {
                setIsLiking(false)
            }
        }
    }

    const handleComment = () => {
        if (!comment.trim()) return

        if (videoPlayerRef.current) {
            const player = videoPlayerRef.current.getPlayer()
            const wasPlaying = !player.paused()

            dispatch(commentOnPost({ postId: video._id, comment: comment.trim() })).then((result) => {
                if (result.type === "posts/comment/fulfilled") {
                    setComment("")
                    if (wasPlaying) {
                        setTimeout(() => player.play().catch(() => { }), 100)
                    }
                }
            })
        } else {
            dispatch(commentOnPost({ postId: video._id, comment: comment.trim() })).then((result) => {
                if (result.type === "posts/comment/fulfilled") {
                    setComment("")
                }
            })
        }
    }

    const isLiked = video.likes?.some((like) => {
        if (typeof like === "object") {
            return like._id === user?._id
        }
        return like === user?._id
    }) || video.isLiked

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

        if (diffInHours < 1) return "Just now"
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
        return `${Math.floor(diffInHours / 168)}w ago`
    }

    const videoUrl = getVideoUrl()
    const posterUrl = getPosterUrl()

    if (!videoUrl) return null

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {video.author?.ProfilePicture ? (
                        <img src={video.author.ProfilePicture || "/placeholder.svg"} alt={video.author.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-600 font-semibold">{video.author?.name?.charAt(0) || "U"}</span>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{video.author?.name || "Unknown User"}</h3>
                    <p className="text-sm text-gray-500">{formatTime(video.createdAt)}</p>
                </div>
            </div>

            {video.caption && (
                <div className="px-4 pb-3">
                    <p className="text-gray-800">{video.caption}</p>
                </div>
            )}

            <div className="relative">
                <VideoJSPlayer ref={videoPlayerRef} src={videoUrl} poster={posterUrl} width="100%" height="400px" autoplay={false} muted={false} enableHotkeys={true} enableFullscreen={true} enablePictureInPicture={true} enableTheater={true} playbackRates={[0.5, 0.75, 1, 1.25, 1.5, 2]} className="rounded-lg" />
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{video.likes?.length || 0} likes</span>
                        <span className="text-sm text-gray-600">{video.comments?.length || 0} comments</span>
                    </div>
                </div>

                <div className="flex items-center space-x-6 py-2 border-t border-gray-100">
                    <button onClick={handleLike} disabled={isLiking} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isLiked ? "text-blue-600 bg-blue-50 hover:bg-blue-100" : "text-gray-600 hover:bg-gray-100"}`}>
                        <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span className="font-medium">Like</span>
                    </button>

                    <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="font-medium">Comment</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span className="font-medium">Share</span>
                    </button>
                </div>

                {showComments && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex space-x-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {user?.ProfilePicture ? (
                                    <img src={user.ProfilePicture || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-600 text-sm font-semibold">{user?.name?.charAt(0) || "U"}</span>
                                )}
                            </div>
                            <div className="flex-1 flex space-x-2">
                                <input type="text" placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)} onKeyPress={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleComment() } }} className="flex-1 px-3 py-2 bg-gray-100 rounded-full border-none outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" />
                                <button onClick={handleComment} disabled={!comment.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Post</button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {video.comments?.map((c, index) => (
                                <div key={index} className="flex space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                                        <span className="text-gray-600 text-sm font-semibold">{c.author?.name?.charAt(0) || "U"}</span>
                                    </div>
                                    <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2">
                                        <p className="font-semibold text-sm text-gray-900">{c.author?.name || "Unknown User"}</p>
                                        <p className="text-gray-800">{c.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Video