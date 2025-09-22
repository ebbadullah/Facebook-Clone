import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Paper, Avatar, Typography, IconButton, Button, Menu, MenuItem, TextField, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import { MoreHoriz, ThumbUp, ChatBubbleOutline, Share, BookmarkBorder, Send, Public, ThumbUpOffAlt, Close, Edit, Delete } from "@mui/icons-material"
import { toast } from "react-toastify"
import { likePost, bookmarkPost, commentOnPost, deletePost, updatePost, setPostReaction } from "../../store/slices/postSlice"
import api from "../../services/api"
import GalleryViewer from "../../Plugins/LightGallery/Index"
import VideoJSPlayer from "../../Plugins/VideoJs/Index"
import { formatPostTime, isCommentAuthor } from "../../utils/helper"
import "../../../src/index.css"
import likeSvg from "../../assets/emojis/like.svg"
import loveSvg from "../../assets/emojis/love.svg"
// import careSvg from "../../assets/emojis/default_small.png"
import hahaSvg from "../../assets/emojis/haha.svg"
import wowSvg from "../../assets/emojis/wow.svg"
import sadSvg from "../../assets/emojis/sad.svg"
import angrySvg from "../../assets/emojis/angry.svg"
// import defaultEmoji from "../../assets/emojis/default.png"

const PostCard = ({ post, onPostUpdate }) => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
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
    const [showReactions, setShowReactions] = useState(false)

    const mediaItems = Array.isArray(post.media) && post.media.length > 0
        ? post.media.map((m) => ({ url: m.url, type: m.type, caption: m.caption || post.caption, alt: m.alt || `Media from ${post.author?.name}`, poster: m.poster }))
        : Array.isArray(post.media_url) && post.media_url.length > 0
            ? post.media_url.map((url, index) => ({
                url,
                type: Array.isArray(post.media_type) && post.media_type[index] 
                    ? post.media_type[index] 
                    : (/\.(mp4|webm|ogg|mov|avi)(\?|$)/i.test(url) ? "video" : "image"),
                caption: post.caption,
                alt: `Post by ${post.author?.name}`,
                poster: post.media_poster
            }))
        : post.media_url
            ? [{ url: post.media_url, type: post.media_type || (/\.(mp4|webm|ogg|mov|avi)(\?|$)/i.test(post.media_url) ? "video" : "image"), caption: post.caption, alt: `Post by ${post.author?.name}`, poster: post.media_poster }]
            : []

    const videoItems = mediaItems.filter((item) => item.type === "video")
    const imageItems = mediaItems.filter((item) => item.type !== "video")

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
    const handleMenuClose = () => setAnchorEl(null)
    
    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);
        try {
            // Toggle like: if already reacted with like -> clear; else set like
            const currentReaction = (post.reactions || []).find(r => (r.user?._id || r.user) === user?._id);
            const nextType = currentReaction?.type === 'like' ? null : 'like';
            const result = await dispatch(setPostReaction({ postId: post._id, type: nextType })).unwrap();
            if (onPostUpdate && result?.data) {
                onPostUpdate(result.data)
            }
        } catch (error) {
            console.error("Reaction error:", error);
            toast.error("Failed to update reaction");
        } finally {
            setIsLiking(false);
        }
    }

    const setReactionQuick = async (type) => {
        if (isLiking) return;
        setIsLiking(true);
        try {
            const current = (post.reactions || []).find(r => (r.user?._id || r.user) === user?._id)?.type;
            const next = current === type ? null : type;
            const result = await dispatch(setPostReaction({ postId: post._id, type: next })).unwrap();
            if (onPostUpdate && result?.data) {
                onPostUpdate(result.data)
            }
        } catch (error) {
            console.error("Reaction error:", error);
            toast.error("Failed to react");
        } finally {
            setIsLiking(false);
            setShowReactions(false);
        }
    }
    
    const handleBookmark = () => dispatch(bookmarkPost(post._id))

    const handleComment = () => {
        if (!comment.trim()) return
        dispatch(commentOnPost({ postId: post._id, comment: comment.trim() })).then((result) => {
            if (result.type === "posts/comment/fulfilled") {
                setComment("")
                toast.success("Comment added!")
            }
        })
    }

    const handleShowLikes = async () => {
        try {
            const response = await api.get(`/posts/${post._id}/likes`)
            setLikesList(response.data.data)
            setShowLikes(true)
        } catch {
            toast.error("Failed to load likes")
        }
    }

    const handleShare = async () => {
        if (!shareCaption.trim()) {
            toast.error("Please add a caption for your share")
            return
        }
        try {
            await api.post(`/posts/${post._id}/share`, { caption: shareCaption })
            toast.success("Post shared successfully!")
            setShowShareDialog(false)
            setShareCaption("")
        } catch {
            toast.error("Failed to share post")
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
        setEditCaption(post.caption || "")
        handleMenuClose()
    }

    const handleSaveEdit = () => {
        if (!editCaption.trim()) {
            toast.error("Caption cannot be empty")
            return
        }
        
        dispatch(updatePost({ postId: post._id, caption: editCaption }))
            .then((result) => {
                if (result.type === "posts/update/fulfilled") {
                    toast.success("Post updated successfully!")
                    setIsEditing(false)
                } else {
                    toast.error("Failed to update post")
                }
            })
            .catch(() => {
                toast.error("Failed to update post")
            })
    }

    const handleDelete = () => {
        dispatch(deletePost(post._id))
            .then((result) => {
                if (result.type === "posts/delete/fulfilled") {
                    toast.success("Post deleted successfully!")
                    setShowDeleteConfirm(false)
                } else {
                    toast.error("Failed to delete post")
                }
            })
            .catch(() => {
                toast.error("Failed to delete post")
            })
    }

    const isLiked = post.likes?.some(like => {
        if (typeof like === 'object') {
            return like._id === user?._id;
        }
        return like === user?._id;
    }) || post.isLiked;

    const myReaction = (post.reactions || []).find(r => (r.user?._id || r.user) === user?._id)?.type;

    const getReactionSrc = (type) => {
        switch (type) {
            case 'like': return likeSvg;
            case 'love': return loveSvg;
            // case 'care': return careSvg; // using provided default_small.png as care icon
            case 'haha': return hahaSvg;
            case 'wow': return wowSvg;
            case 'sad': return sadSvg;
            case 'angry': return angrySvg;
            default: return null;
        }
    }

    const reactionsCount = Array.isArray(post.reactions) ? post.reactions.length : (post.likes?.length || 0);

    const dominantReaction = (() => {
        if (!Array.isArray(post.reactions) || post.reactions.length === 0) return null;
        const counts = post.reactions.reduce((acc, r) => {
            if (!r?.type) return acc;
            acc[r.type] = (acc[r.type] || 0) + 1;
            return acc;
        }, {});
        let best = null;
        let bestCount = -1;
        Object.entries(counts).forEach(([k, v]) => {
            if (v > bestCount) { best = k; bestCount = v; }
        });
        return best;
    })();

    const isAuthor = post.author?._id === user?._id

    return (
        <Paper sx={{ mb: 2, borderRadius: "12px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", border: "1px solid #e4e6ea", overflow: "hidden", maxWidth: "680px", mx: "auto" }} className="post-card fade-in">
            <Box sx={{ p: 3, pb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar src={post.author?.ProfilePicture} className="fb-avatar fb-avatar-large">{post.author?.name?.charAt(0)}</Avatar>
                        <Box>
                            <Typography variant="subtitle1" className="fb-text-primary" sx={{ fontSize: "15px" }}>{post.author?.name || "Unknown User"}</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="caption" className="fb-text-secondary" sx={{ fontSize: "13px" }}>{formatPostTime(post.createdAt)}</Typography>
                                <Typography variant="caption" className="fb-text-secondary">•</Typography>
                                <Public sx={{ fontSize: "12px", color: "#65676b" }} />
                            </Box>
                        </Box>
                    </Box>
                    <IconButton onClick={handleMenuOpen} className="fb-button-secondary" sx={{ color: "#65676b", width: "36px", height: "36px", "&:hover": { backgroundColor: "#f0f2f5" } }}>
                        <MoreHoriz />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { borderRadius: "8px", boxShadow: "0 8px 16px rgba(0,0,0,0.15)", border: "1px solid #e4e6ea" } }}>
                        <MenuItem onClick={handleBookmark} sx={{ py: 1.5, px: 2 }}><BookmarkBorder sx={{ mr: 2, fontSize: "20px" }} /> Save post</MenuItem>
                        {isAuthor && (
                            <>
                                <MenuItem onClick={handleEdit} sx={{ py: 1.5, px: 2 }}><Edit sx={{ mr: 2, fontSize: "20px" }} /> Edit post</MenuItem>
                                <MenuItem onClick={() => { setShowDeleteConfirm(true); handleMenuClose(); }} sx={{ py: 1.5, px: 2, color: "error.main" }}><Delete sx={{ mr: 2, fontSize: "20px" }} /> Delete post</MenuItem>
                            </>
                        )}
                    </Menu>
                </Box>
            </Box>

            <Box sx={{ px: 3, pb: 2 }}>
                {isEditing ? (
                    <Box sx={{ mb: 2 }}>
                        <TextField fullWidth multiline value={editCaption} onChange={(e) => setEditCaption(e.target.value)} variant="outlined" sx={{ mb: 2 }} />
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                            <Button onClick={() => setIsEditing(false)} variant="outlined">Cancel</Button>
                            <Button onClick={handleSaveEdit} variant="contained">Save</Button>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.4, fontSize: "15px", color: "#1c1e21" }}>{post.caption}</Typography>
                )}
            </Box>

            {mediaItems.length > 0 && (
                <Box sx={{ mb: 1 }}>
                    {/* Single media item - show full size */}
                    {mediaItems.length === 1 ? (
                        videoItems.length === 1 ? (
                            <Box sx={{ mb: 0 }}>
                                <VideoJSPlayer 
                                    src={videoItems[0].url} 
                                    poster={videoItems[0].poster} 
                                    className="post-video-player" 
                                    style={{ minHeight: "300px", maxHeight: "500px", borderRadius: "0px" }} 
                                    onReady={() => { }} 
                                    onPlay={() => { }} 
                                    onPause={() => { }} 
                                    controls={true} 
                                    preload="metadata" 
                                    playbackRates={[0.5, 0.75, 1, 1.25, 1.5, 2]} 
                                    enableHotkeys={true} 
                                    enableFullscreen={true} 
                                    enablePictureInPicture={true} 
                                    enableTheater={true} 
                                    responsive={true} 
                                    fluid={true} 
                                />
                            </Box>
                        ) : (
                            <GalleryViewer 
                                items={imageItems} 
                                settings={{ 
                                    showThumbByDefault: false, 
                                    counter: false, 
                                    download: true, 
                                    zoom: true, 
                                    actualSize: true, 
                                    showZoomInOutIcons: true, 
                                    rotate: true, 
                                    flipHorizontal: true, 
                                    flipVertical: true, 
                                    showCloseIcon: true, 
                                    closable: true, 
                                    escKey: true, 
                                    mode: "lg-fade", 
                                    speed: 400, 
                                    addClass: "lg-custom-gallery", 
                                    selector: ".gallery-item" 
                                }} 
                                className="post-gallery" 
                                style={{ minHeight: "400px", maxHeight: "600px" }} 
                                onOpened={() => { }} 
                            />
                        )
                    ) : (
                        /* Multiple media items - show grid view */
                        <Box sx={{ display: "grid", gridTemplateColumns: mediaItems.length === 2 ? "1fr 1fr" : mediaItems.length >= 3 ? "1fr 1fr 1fr" : "1fr", gap: 1 }}>
                            {mediaItems.slice(0, mediaItems.length > 5 ? 5 : mediaItems.length).map((media, index) => (
                                <Box 
                                    key={`media-${index}`} 
                                    sx={{ 
                                        position: "relative",
                                        height: mediaItems.length === 2 ? "300px" : "200px",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        // Handle click to open gallery or video player
                                        const galleryElement = document.querySelector(".gallery-item");
                                        if (galleryElement) {
                                            galleryElement.click();
                                        }
                                    }}
                                >
                                    {media.type === "video" ? (
                                        <Box 
                                            sx={{ 
                                                width: "100%", 
                                                height: "100%", 
                                                backgroundImage: `url(${media.poster || ""})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <IconButton 
                                                sx={{ 
                                                    backgroundColor: "rgba(0,0,0,0.5)", 
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" }
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                            </IconButton>
                                        </Box>
                                    ) : (
                                        <img 
                                            src={media.url} 
                                            alt={media.alt || `Media ${index + 1}`} 
                                            style={{ 
                                                width: "100%", 
                                                height: "100%", 
                                                objectFit: "cover" 
                                            }} 
                                            className="gallery-item"
                                        />
                                    )}
                                    
                                    {/* Show +X overlay for the last visible item if there are more than 5 */}
                                    {mediaItems.length > 5 && index === 4 && (
                                        <Box 
                                            sx={{ 
                                                position: "absolute", 
                                                top: 0, 
                                                left: 0, 
                                                width: "100%", 
                                                height: "100%", 
                                                backgroundColor: "rgba(0,0,0,0.5)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                                fontSize: "24px",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            +{mediaItems.length - 5}
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}
                    
                    <Box sx={{ display: "none" }}>
                        <GalleryViewer 
                            items={mediaItems} 
                            settings={{ 
                                showThumbByDefault: mediaItems.length > 1, 
                                counter: mediaItems.length > 1, 
                                download: true, 
                                zoom: true, 
                                actualSize: true, 
                                showZoomInOutIcons: true, 
                                rotate: true, 
                                flipHorizontal: true, 
                                flipVertical: true, 
                                showCloseIcon: true, 
                                closable: true, 
                                escKey: true, 
                                mode: "lg-fade", 
                                speed: 400, 
                                addClass: "lg-custom-gallery", 
                                selector: ".gallery-item" 
                            }} 
                            className="post-gallery-hidden" 
                            onOpened={() => { }} 
                        />
                    </Box>
                    
                </Box>
            )}

            <Box sx={{ px: 3, py: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Tooltip title={reactionsCount > 0 ? (
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Reactions:</Typography>
                                    {(post.reactions || post.likes || []).slice(0, 3).map((entry, index) => (
                                        <Typography key={index} variant="body2">
                                            {entry?.user?.name || entry?.name || entry?.username || (typeof entry === 'object' ? (entry?.user?._id || entry?._id) : entry)}
                                        </Typography>
                                    ))}
                                    {reactionsCount > 3 && <Typography variant="body2" sx={{ fontStyle: "italic" }}>and {reactionsCount - 3} more...</Typography>}
                                </Box>
                            ) : (
                                <Typography variant="body2">No likes yet</Typography>
                            )} arrow placement="top">
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: reactionsCount > 0 ? "pointer" : "default", "&:hover": { opacity: reactionsCount > 0 ? 0.8 : 1 } }} onClick={reactionsCount > 0 ? handleShowLikes : undefined} className="hover-scale">
                                <Box sx={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: reactionsCount > 0 ? "#f0f2f5" : "#e4e6ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {getReactionSrc(myReaction || dominantReaction) ? (
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 18,
                                            height: 18,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(145deg, #ffffff, #eef1f6)',
                                            boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.06), 1px 2px 4px rgba(0,0,0,0.08)'
                                        }}>
                                            <img src={getReactionSrc(myReaction || dominantReaction) || defaultEmoji} alt="reaction" style={{ width: 14, height: 14 }} />
                                        </span>
                                    ) : (
                                        <ThumbUp sx={{ fontSize: "12px", color: "#65676b" }} />
                                    )}
                                </Box>
                                <Typography variant="body2" className="fb-text-secondary">{reactionsCount}</Typography>
                            </Box>
                        </Tooltip>
                    </Box>
                    <Typography variant="body2" className="fb-text-secondary hover-scale" sx={{ cursor: "pointer" }} onClick={() => setShowComments(!showComments)}>{post.comments?.length || 0} comments</Typography>
                </Box>
            </Box>

            <div className="fb-divider" />

            <Box sx={{ display: "flex", justifyContent: "space-around", py: 1, px: 2 }}>
                <Box onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)} sx={{ position: "relative", flex: 1 }}>
                    <Button
                        startIcon={myReaction ? (
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                background: 'linear-gradient(145deg, #ffffff, #e6e9ef)',
                                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.06), 2px 4px 8px rgba(0,0,0,0.08)'
                            }}>
                                <img src={getReactionSrc(myReaction) || undefined} alt={myReaction} style={{ width: 20, height: 20 }} />
                            </span>
                        ) : (isLiked ? <ThumbUp /> : <ThumbUpOffAlt />)}
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`fb-button ${(isLiked || myReaction) ? "fb-button-primary" : "fb-button-secondary"}`}
                        sx={{ color: (isLiked || myReaction) ? "#1877f2" : "#65676b", textTransform: "none", flex: 1, fontWeight: 600, py: 2, mx: 1, borderRadius: "8px", fontSize: "15px", width: "100%" }}
                    >
                        {myReaction ? myReaction.charAt(0).toUpperCase() + myReaction.slice(1) : (isLiked ? 'Liked' : 'Like')}
                    </Button>
                    {showReactions && (
                        <Box sx={{ position: "absolute", bottom: "100%", left: 12, mb: 1, background: "#fff", border: "1px solid #e4e6ea", borderRadius: "28px", boxShadow: "0 12px 24px rgba(0,0,0,0.15)", p: 1, display: "flex", gap: 1.2, zIndex: 10 }}>
                            {[
                                { k: 'like', src: likeSvg },
                                { k: 'love', src: loveSvg },
                                // { k: 'care', src: careSvg },
                                { k: 'haha', src: hahaSvg },
                                { k: 'wow', src: wowSvg },
                                { k: 'sad', src: sadSvg },
                                { k: 'angry', src: angrySvg },
                            ].map(r => (
                                <button
                                    key={r.k}
                                    onClick={() => setReactionQuick(r.k)}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: 'linear-gradient(145deg, #ffffff, #eef1f6)',
                                        boxShadow: '2px 4px 10px rgba(0,0,0,0.12), -2px -2px 8px rgba(255,255,255,0.9)',
                                        fontSize: 22,
                                        lineHeight: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'transform 120ms ease, box-shadow 120ms ease'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.06)'; e.currentTarget.style.boxShadow = '4px 8px 16px rgba(0,0,0,0.18), -2px -2px 8px rgba(255,255,255,0.95)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 4px 10px rgba(0,0,0,0.12), -2px -2px 8px rgba(255,255,255,0.9)'; }}
                                >
                                    <img src={r.src} alt={r.k} style={{ width: 24, height: 24 }} />
                                </button>
                            ))}
                        </Box>
                    )}
                </Box>
                <Button startIcon={<ChatBubbleOutline />} onClick={() => setShowComments(!showComments)} className="fb-button fb-button-secondary" sx={{ color: "#65676b", textTransform: "none", fontWeight: 600, flex: 1, py: 2, mx: 1, borderRadius: "8px", fontSize: "15px" }}>
                    Comment
                </Button>
                <Button startIcon={<Share />} onClick={() => setShowShareDialog(true)} className="fb-button fb-button-secondary" sx={{ color: "#65676b", textTransform: "none", fontWeight: 600, flex: 1, py: 2, mx: 1, borderRadius: "8px", fontSize: "15px" }}>
                    Share
                </Button>
            </Box>

            {showComments && (
                <>
                    <div className="fb-divider" />
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                            <Avatar src={user?.ProfilePicture} className="fb-avatar fb-avatar-small">{user?.name?.charAt(0)}</Avatar>
                            <Box sx={{ flex: 1, display: "flex", gap: 1 }}>
                                <TextField fullWidth size="small" placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)} onKeyPress={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleComment() } }} className="fb-input" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px", backgroundColor: "#f0f2f5", border: "none", "& fieldset": { border: "none" }, "&:hover": { backgroundColor: "#e4e6ea" }, "&.Mui-focused": { backgroundColor: "#ffffff", boxShadow: "0 0 0 2px rgba(24, 119, 242, 0.2)" } } }} />
                                <IconButton onClick={handleComment} disabled={!comment.trim()} className="fb-button-primary" sx={{ color: comment.trim() ? "#1877f2" : "#bcc0c4", width: "36px", height: "36px" }}>
                                    <Send />
                                </IconButton>
                            </Box>
                        </Box>
                        {post.comments?.map((c, index) => {
                            const isAuthorComment = isCommentAuthor(c.author?._id, user?._id);
                            
                            return (
                                <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }} className="fade-in">
                                    <Avatar className="fb-avatar fb-avatar-small">{c.author?.name?.charAt(0)}</Avatar>
                                    <Box sx={{ backgroundColor: "#f0f2f5", borderRadius: "16px", px: 3, py: 2, flex: 1 }}>
                                        <Typography variant="subtitle2" className="fb-text-primary" sx={{ fontSize: "13px", fontWeight: isAuthorComment ? 'bold' : 'normal', color: isAuthorComment ? '#1877f2' : '#1c1e21' }}>
                                            {c.author?.name}
                                            {isAuthorComment && " (You)"}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#1c1e21", fontSize: "14px" }}>{c.comment}</Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </>
            )}

            <Dialog open={showLikes} onClose={() => setShowLikes(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6">People who liked this post</Typography>
                        <IconButton onClick={() => setShowLikes(false)}><Close /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <List>
                        {likesList.map((u) => (
                            <ListItem key={u._id}>
                                <ListItemAvatar><Avatar src={u.ProfilePicture}>{u.name?.charAt(0)}</Avatar></ListItemAvatar>
                                <ListItemText primary={u.name} secondary={u.username} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>

            <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6">Share Post</Typography>
                        <IconButton onClick={() => setShowShareDialog(false)}><Close /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Add a caption to your share:</Typography>
                        <TextField fullWidth multiline rows={3} value={shareCaption} onChange={(e) => setShareCaption(e.target.value)} placeholder="What's on your mind?" variant="outlined" />
                    </Box>
                    <Box sx={{ border: "1px solid #e4e6ea", borderRadius: 2, p: 2, backgroundColor: "#f8f9fa" }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Avatar src={post.author?.ProfilePicture} sx={{ width: 32, height: 32, mr: 1 }}>{post.author?.name?.charAt(0)}</Avatar>
                            <Typography variant="subtitle2" fontWeight={600}>{post.author?.name}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>{post.caption}</Typography>
                        {mediaItems[0] && (
                            <Box sx={{ width: "100%", height: 120, borderRadius: 1, overflow: "hidden", backgroundColor: "#e4e6ea" }}>
                                {mediaItems[0].type === "video" ? (
                                    <VideoJSPlayer src={mediaItems[0].url} style={{ width: "100%", height: "100%", borderRadius: "4px" }} controls={false} preload="metadata" enableHotkeys={false} enableFullscreen={false} enablePictureInPicture={false} enableTheater={false} />
                                ) : (
                                    <img src={mediaItems[0].url || "/placeholder.svg"} alt="Post preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                )}
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowShareDialog(false)}>Cancel</Button>
                    <Button onClick={handleShare} variant="contained" disabled={!shareCaption.trim()}>Share</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6">Delete Post</Typography>
                        <IconButton onClick={() => setShowDeleteConfirm(false)}><Close /></IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>Are you sure you want to delete this post? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}

export default PostCard