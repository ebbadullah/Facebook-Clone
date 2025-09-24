import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { likePost, bookmarkPost, commentOnPost, deletePost, updatePost, addReaction, getReactions } from "../../store/slices/postSlice"
import api from "../../services/api"

export const usePost = (post) => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    
    // State management
    const [anchorEl, setAnchorEl] = useState(null)
    const [showComments, setShowComments] = useState(false)
    const [comment, setComment] = useState("")
    const [showLikes, setShowLikes] = useState(false)
    const [likesList, setLikesList] = useState([])
    const [showShareDialog, setShowShareDialog] = useState(false)
    const [shareCaption, setShareCaption] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editCaption, setEditCaption] = useState(post.caption || "")
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isLiking, setIsLiking] = useState(false)
    const [reactionAnchorEl, setReactionAnchorEl] = useState(null)
    const [reactionsList, setReactionsList] = useState([])
    
    const popoverTimerRef = useRef(null)

    // Memoize media items to prevent unnecessary recalculations
    const mediaItems = useMemo(() => {
        if (Array.isArray(post.media) && post.media.length > 0) {
            return post.media.map((m) => ({ 
                url: m.url, 
                type: m.type, 
                caption: m.caption || post.caption, 
                alt: m.alt || `Media from ${post.author?.name}`,
                poster: m.poster 
            }))
        } else if (Array.isArray(post.media_url) && post.media_url.length > 0) {
            return post.media_url.map((url, index) => ({
                url,
                type: Array.isArray(post.media_type) && post.media_type[index]
                    ? post.media_type[index]
                    : (/\.(mp4|webm|ogg|mov|avi)(\?|$)/i.test(url) ? "video" : "image"),
                caption: post.caption,
                alt: `Post by ${post.author?.name}`,
                poster: post.media_poster
            }))
        } else if (post.media_url) {
            return [{ 
                url: post.media_url, 
                type: post.media_type || (/\.(mp4|webm|ogg|mov|avi)(\?|$)/i.test(post.media_url) ? "video" : "image"), 
                caption: post.caption, 
                alt: `Post by ${post.author?.name}`, 
                poster: post.media_poster 
            }]
        }
        return []
    }, [post.media, post.media_url, post.media_type, post.caption, post.author?.name, post.media_poster])

    const videoItems = useMemo(() => mediaItems.filter((item) => item.type === "video"), [mediaItems])
    const imageItems = useMemo(() => mediaItems.filter((item) => item.type !== "video"), [mediaItems])

    const isLiked = useMemo(() => 
        post.likes?.some(like => (typeof like === 'object' ? like._id === user?._id : like === user?._id)) || post.isLiked, 
        [post.likes, post.isLiked, user?._id]
    )
    
    const isAuthor = useMemo(() => post.author?._id === user?._id, [post.author?._id, user?._id])

    // Load reactions only when needed
    useEffect(() => {
        if (post?._id && (post.reactions?.length > 0 || post.likes?.length > 0)) {
            handleGetReactions()
        }
    }, [post._id])

    // Menu handlers
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
    const handleMenuClose = () => setAnchorEl(null)

    // Reaction handlers
    const handleShowReactionOptions = useCallback((event) => {
        if (popoverTimerRef.current) {
            clearTimeout(popoverTimerRef.current)
        }
        setReactionAnchorEl(event.currentTarget)
        event.stopPropagation()
    }, [])

    const handleCloseReactionOptions = useCallback(() => {
        popoverTimerRef.current = setTimeout(() => {
            setReactionAnchorEl(null)
        }, 300)
    }, [])

    const handleCancelCloseReaction = useCallback(() => {
        if (popoverTimerRef.current) {
            clearTimeout(popoverTimerRef.current)
        }
    }, [])

    const handleAddReaction = async (reactionType) => {
        if (isLiking) return
        setIsLiking(true)
        setReactionAnchorEl(null)

        try {
            const result = await dispatch(addReaction({
                postId: post._id,
                reactionType,
                userId: user._id
            })).unwrap()

            if (result.data) toast.success(`Reaction added: ${reactionType}`)
        } catch (error) {
            toast.error("Failed to add reaction")
        } finally {
            setIsLiking(false)
        }
    }

    const handleGetReactions = async () => {
        try {
            const result = await dispatch(getReactions(post._id)).unwrap()
            if (result.data && result.data.reactions) {
                setReactionsList(result.data.reactions)
            }
        } catch (error) {
            console.error("Failed to get reactions:", error)
        }
    }

    const handleLike = async () => {
        if (isLiking) return
        setIsLiking(true)
        try {
            const result = await dispatch(likePost(post._id)).unwrap()
            if (result.data && result.data.message) {
                if (result.data.message.includes("liked")) toast.success("Post liked!")
                else if (result.data.message.includes("unliked")) toast.info("Post unliked")
            }
        } catch (error) {
            toast.error("Failed to like post")
        } finally {
            setIsLiking(false)
        }
    }

    const handleBookmark = async () => {
        try {
            const result = await dispatch(bookmarkPost(post._id)).unwrap()
            if (result.data && result.data.message) {
                if (result.data.message.includes("bookmarked")) toast.success("Post saved!")
                else if (result.data.message.includes("removed")) toast.info("Post removed from saved")
            }
            handleMenuClose()
        } catch (error) {
            toast.error("Failed to save post")
        }
    }

    const handleComment = async () => {
        if (!comment.trim()) return
        try {
            const result = await dispatch(commentOnPost({ postId: post._id, comment: comment.trim() })).unwrap()
            if (result.data) {
                setComment("")
                toast.success("Comment added!")
            }
        } catch (error) {
            toast.error("Failed to add comment")
        }
    }

    const handleShowLikes = async () => {
        try {
            const response = await api.get(`/posts/${post._id}/likes`)
            if (response.data.success) setLikesList(response.data.data)
            setShowLikes(true)
        } catch (error) {
            toast.error("Failed to load likes")
        }
    }

    const handleShowReactionsList = async () => {
        try {
            const response = await api.get(`/posts/${post._id}/reactions`)
            if (response.data.success) setReactionsList(response.data.data)
            setShowLikes(true)
        } catch (error) {
            toast.error("Failed to load reactions")
        }
    }

    const handleShare = async () => {
        try {
            const response = await api.post(`/posts/${post._id}/share`, { caption: shareCaption })
            if (response.data.success) {
                setShareCaption("")
                setShowShareDialog(false)
                toast.success("Post shared!")
            }
        } catch (error) {
            toast.error("Failed to share post")
        }
    }

    const handleEdit = () => {
        setEditCaption(post.caption || "")
        setIsEditing(true)
        handleMenuClose()
    }

    const handleSaveEdit = async () => {
        try {
            const result = await dispatch(updatePost({ postId: post._id, caption: editCaption })).unwrap()
            if (result.data) {
                setIsEditing(false)
                toast.success("Post updated!")
            }
        } catch (error) {
            toast.error("Failed to update post")
        }
    }

    const handleDelete = async () => {
        try {
            const result = await dispatch(deletePost(post._id)).unwrap()
            if (result.data) {
                setShowDeleteConfirm(false)
                toast.success("Post deleted!")
            }
        } catch (error) {
            toast.error("Failed to delete post")
        }
    }

    useEffect(() => {
        return () => {
            if (popoverTimerRef.current) {
                clearTimeout(popoverTimerRef.current)
            }
        }
    }, [])

    return {
        user,
        anchorEl,
        showComments,
        comment,
        showLikes,
        likesList,
        showShareDialog,
        shareCaption,
        isEditing,
        editCaption,
        showDeleteConfirm,
        isLiking,
        reactionAnchorEl,
        reactionsList,
        mediaItems,
        videoItems,
        imageItems,
        isLiked,
        isAuthor,
        
        // Handlers
        handleMenuOpen,
        handleMenuClose,
        handleShowReactionOptions,
        handleCloseReactionOptions,
        handleCancelCloseReaction,
        handleAddReaction,
        handleLike,
        handleBookmark,
        handleComment,
        handleShowLikes,
        handleShowReactionsList,
        handleShare,
        handleEdit,
        handleSaveEdit,
        handleDelete,
        setComment,
        setShowComments,
        setShareCaption,
        setShowShareDialog,
        setEditCaption,
        setIsEditing,
        setShowDeleteConfirm
    }
}