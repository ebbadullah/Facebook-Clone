import { useEffect, useRef, useCallback } from "react"

export const VideoJSPlayer = ({
    src, poster, className = "", style = {}, onReady = () => { }, onPlay = () => { }, onPause = () => { }, onEnded = () => { }, controls = true, autoplay = false, muted = false, loop = false, preload = "metadata", width = "100%", height = "auto", responsive = true, fluid = true, playbackRates = [0.5, 1, 1.25, 1.5, 2], enableHotkeys = true, enableFullscreen = true, enablePictureInPicture = true, enableTheater = true, quality = "auto", subtitles = [], thumbnails = null,
}) => {
    const videoRef = useRef(null)
    const playerRef = useRef(null)
    const containerRef = useRef(null)

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "0:00"
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const createCustomControls = useCallback((video) => {
        const controls = document.createElement("div")
        controls.className = "custom-controls"

        const playbackRateOptions = playbackRates.map((rate) => `<option value="${rate}"${rate === 1 ? " selected" : ""}>${rate}x</option>`).join("")
        const pipButton = enablePictureInPicture ? `<button class="pip-btn" title="Picture in Picture (P)"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1.9-2-2-2zm0 16H3V5h18v14z"/></svg></button>` : ""
        const theaterButton = enableTheater ? `<button class="theater-btn" title="Theater Mode (T)"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1.9-2-2-2zm0 10H5V8h14v8z"/></svg></button>` : ""
        const fullscreenButton = enableFullscreen ? `<button class="fullscreen-btn" title="Fullscreen (F)"><svg class="fullscreen-enter" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg><svg class="fullscreen-exit" viewBox="0 0 24 24" fill="currentColor" style="display: none;"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg></button>` : ""

        controls.innerHTML = `
            <div class="video-controls-overlay">
                <div class="video-progress-container">
                    <div class="video-progress-bar"><div class="video-progress-filled"></div><div class="video-progress-handle"></div></div>
                    <div class="video-time-display"><span class="current-time">0:00</span> / <span class="duration">0:00</span></div>
                </div>
                <div class="video-control-buttons">
                    <div class="control-buttons-left">
                        <button class="play-pause-btn" title="Play/Pause (Space)">
                            <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                            <svg class="pause-icon" viewBox="0 0 24 24" fill="currentColor" style="display: none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        </button>
                        <button class="volume-btn" title="Mute/Unmute (M)">
                            <svg class="volume-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                        </button>
                        <div class="volume-slider-container"><input type="range" class="volume-slider" min="0" max="1" step="0.1" value="1"></div>
                        <div class="playback-rate-container"><select class="playback-rate-select" title="Playback Speed">${playbackRateOptions}</select></div>
                    </div>
                    <div class="control-buttons-right">${pipButton}${theaterButton}${fullscreenButton}</div>
                </div>
            </div>
        `
        return controls
    }, [playbackRates, enablePictureInPicture, enableTheater, enableFullscreen])

    const addControlsLogic = useCallback((controls, video) => {
        const playPauseBtn = controls.querySelector(".play-pause-btn")
        const volumeBtn = controls.querySelector(".volume-btn")
        const volumeSlider = controls.querySelector(".volume-slider")
        const progressBar = controls.querySelector(".video-progress-bar")
        const progressFilled = controls.querySelector(".video-progress-filled")
        const currentTimeSpan = controls.querySelector(".current-time")
        const durationSpan = controls.querySelector(".duration")
        const playbackRateSelect = controls.querySelector(".playback-rate-select")
        const pipBtn = controls.querySelector(".pip-btn")
        const theaterBtn = controls.querySelector(".theater-btn")
        const fullscreenBtn = controls.querySelector(".fullscreen-btn")

        if (playPauseBtn) {
            playPauseBtn.addEventListener("click", () => { video.paused ? video.play() : video.pause() })
        }

        const updatePlayPauseIcon = () => {
            const playIcon = playPauseBtn?.querySelector(".play-icon")
            const pauseIcon = playPauseBtn?.querySelector(".pause-icon")
            if (video.paused) {
                if (playIcon) playIcon.style.display = "block"
                if (pauseIcon) pauseIcon.style.display = "none"
            } else {
                if (playIcon) playIcon.style.display = "none"
                if (pauseIcon) pauseIcon.style.display = "block"
            }
        }

        video.addEventListener("play", updatePlayPauseIcon)
        video.addEventListener("pause", updatePlayPauseIcon)

        if (volumeBtn) {
            volumeBtn.addEventListener("click", () => {
                video.muted = !video.muted
                if (volumeSlider) volumeSlider.value = video.muted ? 0 : video.volume
            })
        }

        if (volumeSlider) {
            volumeSlider.addEventListener("input", (e) => {
                video.volume = e.target.value
                video.muted = e.target.value == 0
            })
        }

        const updateProgress = () => {
            if (video.duration && progressFilled && currentTimeSpan) {
                const progress = (video.currentTime / video.duration) * 100
                progressFilled.style.width = `${progress}%`
                currentTimeSpan.textContent = formatTime(video.currentTime)
            }
        }

        const updateDuration = () => {
            if (durationSpan && video.duration) durationSpan.textContent = formatTime(video.duration)
        }

        video.addEventListener("timeupdate", updateProgress)
        video.addEventListener("loadedmetadata", updateDuration)

        if (progressBar) {
            progressBar.addEventListener("click", (e) => {
                const rect = progressBar.getBoundingClientRect()
                const pos = (e.clientX - rect.left) / rect.width
                video.currentTime = pos * video.duration
            })
        }

        if (playbackRateSelect) {
            playbackRateSelect.addEventListener("change", (e) => { video.playbackRate = Number.parseFloat(e.target.value) })
        }

        if (pipBtn) {
            pipBtn.addEventListener("click", async () => {
                try {
                    if (document.pictureInPictureElement) await document.exitPictureInPicture()
                    else await video.requestPictureInPicture()
                } catch (error) { console.error("PiP error:", error) }
            })
        }

        if (theaterBtn) {
            theaterBtn.addEventListener("click", () => { containerRef.current?.classList.toggle("theater-mode") })
        }

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener("click", () => {
                if (document.fullscreenElement) document.exitFullscreen()
                else containerRef.current?.requestFullscreen()
            })
        }

        const handleFullscreenChange = () => {
            const enterIcon = fullscreenBtn?.querySelector(".fullscreen-enter")
            const exitIcon = fullscreenBtn?.querySelector(".fullscreen-exit")
            if (document.fullscreenElement) {
                if (enterIcon) enterIcon.style.display = "none"
                if (exitIcon) exitIcon.style.display = "block"
            } else {
                if (enterIcon) enterIcon.style.display = "block"
                if (exitIcon) exitIcon.style.display = "none"
            }
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange)

        return () => {
            video.removeEventListener("play", updatePlayPauseIcon)
            video.removeEventListener("pause", updatePlayPauseIcon)
            video.removeEventListener("timeupdate", updateProgress)
            video.removeEventListener("loadedmetadata", updateDuration)
            document.removeEventListener("fullscreenchange", handleFullscreenChange)
        }
    }, [])

    const addKeyboardShortcuts = useCallback((video) => {
        const handleKeyPress = (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return
            switch (e.key.toLowerCase()) {
                case " ": case "k": e.preventDefault(); video.paused ? video.play() : video.pause(); break
                case "arrowleft": e.preventDefault(); video.currentTime -= 10; break
                case "arrowright": e.preventDefault(); video.currentTime += 10; break
                case "arrowup": e.preventDefault(); video.volume = Math.min(1, video.volume + 0.1); break
                case "arrowdown": e.preventDefault(); video.volume = Math.max(0, video.volume - 0.1); break
                case "m": e.preventDefault(); video.muted = !video.muted; break
                case "f": e.preventDefault(); document.fullscreenElement ? document.exitFullscreen() : containerRef.current?.requestFullscreen(); break
                case "p": e.preventDefault(); if (enablePictureInPicture) video.requestPictureInPicture().catch(console.error); break
                case "t": e.preventDefault(); containerRef.current?.classList.toggle("theater-mode"); break
            }
        }

        document.addEventListener("keydown", handleKeyPress)
        return () => document.removeEventListener("keydown", handleKeyPress)
    }, [enablePictureInPicture])

    const initializePlayer = useCallback(() => {
        if (!videoRef.current || !containerRef.current) return
        const video = videoRef.current

        video.src = src
        if (poster) video.poster = poster
        else {
            video.addEventListener("loadeddata", () => {
                if (!poster) {
                    const canvas = document.createElement("canvas")
                    const ctx = canvas.getContext("2d")
                    canvas.width = video.videoWidth
                    canvas.height = video.videoHeight
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                    video.poster = canvas.toDataURL()
                }
            })
        }
        video.controls = false
        video.autoplay = autoplay
        video.muted = muted
        video.loop = loop
        video.preload = preload

        const existingControls = containerRef.current.querySelector(".custom-controls")
        if (existingControls) existingControls.remove()

        const controlsOverlay = createCustomControls(video)
        containerRef.current.appendChild(controlsOverlay)

        const cleanupControls = addControlsLogic(controlsOverlay, video)

        video.addEventListener("loadedmetadata", onReady)
        video.addEventListener("play", onPlay)
        video.addEventListener("pause", onPause)
        video.addEventListener("ended", onEnded)

        let cleanupKeyboard
        if (enableHotkeys) cleanupKeyboard = addKeyboardShortcuts(video)

        playerRef.current = video

        return () => {
            video.removeEventListener("loadedmetadata", onReady)
            video.removeEventListener("play", onPlay)
            video.removeEventListener("pause", onPause)
            video.removeEventListener("ended", onEnded)
            if (cleanupControls) cleanupControls()
            if (cleanupKeyboard) cleanupKeyboard()
        }
    }, [src, poster, autoplay, muted, loop, preload, onReady, onPlay, onPause, onEnded, enableHotkeys, createCustomControls, addControlsLogic, addKeyboardShortcuts])

    useEffect(() => {
        const cleanup = initializePlayer()
        return cleanup
    }, [initializePlayer])

    const cssStyles = `
        .videojs-player-container { --primary-color: #1877f2; --control-bg: rgba(0, 0, 0, 0.7); --control-hover: rgba(255, 255, 255, 0.1); position: relative; background-color: #000; border-radius: 8px; overflow: hidden; }
        .videojs-player { width: 100%; height: 100%; object-fit: contain; }
        .custom-controls { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, var(--control-bg)); padding: 20px 16px 16px; opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
        .videojs-player-container:hover .custom-controls, .custom-controls:hover { opacity: 1; pointer-events: all; }
        .video-progress-container { margin-bottom: 12px; }
        .video-progress-bar { height: 4px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; cursor: pointer; position: relative; margin-bottom: 8px; }
        .video-progress-filled { height: 100%; background: var(--primary-color); border-radius: 2px; transition: width 0.1s ease; width: 0%; }
        .video-progress-handle { position: absolute; top: 50%; right: 0; width: 12px; height: 12px; background: var(--primary-color); border-radius: 50%; transform: translate(50%, -50%); opacity: 0; transition: opacity 0.2s ease; }
        .video-progress-bar:hover .video-progress-handle { opacity: 1; }
        .video-time-display { color: white; font-size: 12px; font-family: monospace; }
        .video-control-buttons { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .control-buttons-left, .control-buttons-right { display: flex; align-items: center; gap: 12px; }
        .video-control-buttons button { background: none; border: none; color: white; cursor: pointer; padding: 8px; border-radius: 4px; transition: background-color 0.2s ease; display: flex; align-items: center; justify-content: center; }
        .video-control-buttons button:hover { background: var(--control-hover); }
        .video-control-buttons svg { width: 20px; height: 20px; }
        .volume-slider-container { display: flex; align-items: center; }
        .volume-slider { width: 60px; height: 4px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; outline: none; cursor: pointer; -webkit-appearance: none; appearance: none; }
        .volume-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: var(--primary-color); cursor: pointer; }
        .volume-slider::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: var(--primary-color); cursor: pointer; border: none; }
        .playback-rate-select { background: var(--control-bg); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer; }
        .theater-mode { position: fixed !important; top: 0; left: 0; width: 100vw !important; height: 100vh !important; z-index: 9999; background: #000; }
        @media (max-width: 768px) {
            .video-control-buttons { gap: 8px; }
            .control-buttons-left, .control-buttons-right { gap: 6px; }
            .video-control-buttons svg { width: 18px; height: 18px; }
            .volume-slider-container, .playback-rate-container { display: none; }
        }
        @media (max-width: 480px) {
            .control-buttons-left, .control-buttons-right { gap: 4px; }
            .video-control-buttons button { padding: 6px; }
        }
    `

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
            <div ref={containerRef} className={`videojs-player-container ${className}`} style={{ width: width, height: height, ...style }}>
                <video ref={videoRef} className="videojs-player" playsInline crossOrigin="anonymous" />
            </div>
        </>
    )
}

export default VideoJSPlayer