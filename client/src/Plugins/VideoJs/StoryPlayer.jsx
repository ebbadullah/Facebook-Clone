import { useEffect, useRef, useState } from "react"
import { IconButton, Box } from "@mui/material"
import { PlayArrow, Pause, VolumeOff, VolumeUp } from "@mui/icons-material"
import "video.js/dist/video-js.css"

const StoryPlayer = ({ url, playing = true, onEnded, onPlay, onPause, width = "100%", height = "100%" }) => {
    const videoRef = useRef(null)
    const playerRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(playing)
    const [isMuted, setIsMuted] = useState(false)
    const [showControls, setShowControls] = useState(false)

    useEffect(() => {
        const initializePlayer = async () => {
            if (typeof window !== "undefined") {
                const videojs = (await import("video.js")).default
                if (videoRef.current && !playerRef.current) {
                    playerRef.current = videojs(videoRef.current, {
                        controls: false, autoplay: playing, preload: "auto", fluid: false, responsive: false, aspectRatio: "9:16", playbackRates: [1],
                        sources: [{ src: url, type: "video/mp4" }],
                    })

                    playerRef.current.on("ended", () => { setIsPlaying(false); onEnded?.() })
                    playerRef.current.on("play", () => { setIsPlaying(true); onPlay?.() })
                    playerRef.current.on("pause", () => { setIsPlaying(false); onPause?.() })

                    let controlsTimeout
                    const showControlsTemporarily = () => {
                        setShowControls(true)
                        clearTimeout(controlsTimeout)
                        controlsTimeout = setTimeout(() => { setShowControls(false) }, 3000)
                    }

                    playerRef.current.on("mousemove", showControlsTemporarily)
                    playerRef.current.on("touchstart", showControlsTemporarily)
                }
            }
        }

        initializePlayer()
        return () => { if (playerRef.current) { playerRef.current.dispose(); playerRef.current = null } }
    }, [url])

    useEffect(() => {
        if (playerRef.current) {
            if (playing && !isPlaying) playerRef.current.play()
            else if (!playing && isPlaying) playerRef.current.pause()
        }
    }, [playing])

    const handlePlayPause = () => { if (playerRef.current) { isPlaying ? playerRef.current.pause() : playerRef.current.play() } }
    const handleMuteToggle = () => { if (playerRef.current) { const newMutedState = !isMuted; playerRef.current.muted(newMutedState); setIsMuted(newMutedState) } }
    const handleVideoClick = (e) => { e.preventDefault(); handlePlayPause() }

    return (
        <Box sx={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "black" }}>
            <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "calc((100vw - 56.25vh) / 2)", backgroundColor: "black", zIndex: 1, "@media (max-aspect-ratio: 9/16)": { width: 0 } }} />
            <Box sx={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "calc((100vw - 56.25vh) / 2)", backgroundColor: "black", zIndex: 1, "@media (max-aspect-ratio: 9/16)": { width: 0 } }} />

            <Box sx={{ position: "relative", width: "100%", height: "100%", maxWidth: "56.25vh", maxHeight: "100vh", cursor: "pointer" }} onClick={handleVideoClick}>
                <video ref={videoRef} className="video-js vjs-default-skin" style={{ width: "100%", height: "100%", objectFit: "cover" }} playsInline webkit-playsinline="true" />

                <Box sx={{ position: "absolute", top: 16, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10, opacity: showControls ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: showControls ? "auto" : "none" }}>
                    <IconButton onClick={(e) => { e.stopPropagation(); handlePlayPause() }} sx={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.5)", width: 32, height: 32, "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" } }}>
                        {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
                    </IconButton>
                    <IconButton onClick={(e) => { e.stopPropagation(); handleMuteToggle() }} sx={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.5)", width: 32, height: 32, "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" } }}>
                        {isMuted ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
                    </IconButton>
                </Box>

                {!isPlaying && (
                    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
                        <IconButton onClick={(e) => { e.stopPropagation(); handlePlayPause() }} sx={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.6)", width: 64, height: 64, "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" } }}>
                            <PlayArrow sx={{ fontSize: 32 }} />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default StoryPlayer