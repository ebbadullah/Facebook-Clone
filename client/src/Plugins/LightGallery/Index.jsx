import { useRef, useEffect } from "react"
import LightGallery from "lightgallery/react"
import lgThumbnail from "lightgallery/plugins/thumbnail"
import lgVideo from "lightgallery/plugins/video"
import lgZoom from "lightgallery/plugins/zoom"
import lgFullscreen from "lightgallery/plugins/fullscreen"
import lgAutoplay from "lightgallery/plugins/autoplay"
import lgRotate from "lightgallery/plugins/rotate"
import "lightgallery/css/lightgallery.css"
import "lightgallery/css/lg-thumbnail.css"
import "lightgallery/css/lg-video.css"
import "lightgallery/css/lg-zoom.css"
import "lightgallery/css/lg-fullscreen.css"
import "lightgallery/css/lg-autoplay.css"
import "lightgallery/css/lg-rotate.css"

const GalleryViewer = ({
    items,
    settings = {},
    className = "",
    onInit = () => { },
    onBeforeOpen = () => { },
    onOpened = () => { },
    onClosed = () => { },
    gridMode = false,
    showThumbnails = true,
    style = {},
}) => {
    const lightGalleryRef = useRef(null)
    const gridGalleryRef = useRef(null)

    const defaultSettings = {
        speed: 400,
        download: true,
        counter: true,
        enableDrag: true,
        enableSwipe: true,
        mousewheel: true,
        getCaptionFromTitleOrAlt: true,
        showCloseIcon: true,
        closable: true,
        closeOnTap: false,
        escKey: true,
        showThumbByDefault: showThumbnails && items.length > 1,
        allowMediaOverlap: true,
        zoom: true,
        actualSize: true,
        showZoomInOutIcons: true,
        zoomFromOrigin: false,
        controls: true,
        rotate: true,
        flipHorizontal: true,
        flipVertical: true,
        thumbWidth: 100,
        thumbHeight: 80,
        thumbMargin: 5,
        swipeThreshold: 50,
        enableTouch: true,
        touchSwipeThreshold: 50,
        addClass: "lg-custom-gallery lg-enhanced",
        mode: "lg-fade",
        backdropDuration: 300,
        hideBarsDelay: 2000,
        ...settings,
    }

    useEffect(() => {
        const style = document.createElement("style")
        style.textContent = `
            .lg-enhanced .lg-toolbar { background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%); padding: 20px; border-radius: 0 0 12px 12px; }
            .lg-enhanced .lg-close { background: rgba(255,255,255,0.9) !important; color: #1c1e21 !important; border-radius: 50% !important; width: 44px !important; height: 44px !important; font-size: 20px !important; font-weight: bold !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important; transition: all 0.2s ease !important; top: 20px !important; right: 20px !important; }
            .lg-enhanced .lg-close:hover { background: #ffffff !important; transform: scale(1.1) !important; box-shadow: 0 6px 16px rgba(0,0,0,0.4) !important; }
            .lg-enhanced .lg-zoom-in, .lg-enhanced .lg-zoom-out, .lg-enhanced .lg-actual-size, .lg-enhanced .lg-rotate-left, .lg-enhanced .lg-rotate-right, .lg-enhanced .lg-flip-hor, .lg-enhanced .lg-flip-ver { background: rgba(255,255,255,0.9) !important; color: #1c1e21 !important; border-radius: 8px !important; width: 40px !important; height: 40px !important; margin: 0 4px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important; transition: all 0.2s ease !important; }
            .lg-enhanced .lg-zoom-in:hover, .lg-enhanced .lg-zoom-out:hover, .lg-enhanced .lg-actual-size:hover, .lg-enhanced .lg-rotate-left:hover, .lg-enhanced .lg-rotate-right:hover, .lg-enhanced .lg-flip-hor:hover, .lg-enhanced .lg-flip-ver:hover { background: #ffffff !important; transform: translateY(-2px) !important; box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important; }
            .lg-enhanced .lg-counter { background: rgba(0,0,0,0.7) !important; color: white !important; padding: 8px 16px !important; border-radius: 20px !important; font-weight: 600 !important; font-size: 14px !important; top: 20px !important; left: 50% !important; transform: translateX(-50%) !important; }
            .lg-enhanced .lg-prev, .lg-enhanced .lg-next { background: rgba(255,255,255,0.9) !important; color: #1c1e21 !important; border-radius: 50% !important; width: 50px !important; height: 50px !important; font-size: 24px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important; transition: all 0.2s ease !important; }
            .lg-enhanced .lg-prev:hover, .lg-enhanced .lg-next:hover { background: #ffffff !important; transform: scale(1.1) !important; box-shadow: 0 6px 16px rgba(0,0,0,0.4) !important; }
            .lg-enhanced .lg-backdrop { background: rgba(0,0,0,0.95) !important; }
            .lg-enhanced .lg-sub-html { background: linear-gradient(transparent, rgba(0,0,0,0.8)) !important; padding: 40px 20px 20px !important; border-radius: 12px 12px 0 0 !important; }
            .lg-enhanced .lg-thumb-outer { background: rgba(0,0,0,0.9) !important; border-radius: 12px 12px 0 0 !important; }
            .lg-enhanced .lg-thumb-item { border-radius: 8px !important; overflow: hidden !important; transition: all 0.2s ease !important; }
            .lg-enhanced .lg-thumb-item:hover { transform: scale(1.05) !important; }
            .lg-enhanced .lg-thumb-item.active { border: 3px solid #1877f2 !important; transform: scale(1.1) !important; }
        `
        document.head.appendChild(style)
        return () => { document.head.removeChild(style) }
    }, [])

    const onInitHandler = (detail) => { console.log("[v0] Enhanced LightGallery initialized with better controls", detail); onInit(detail) }
    const onBeforeOpenHandler = (detail) => { console.log("[v0] Enhanced LightGallery opening with close icon", detail); onBeforeOpen(detail) }
    const onOpenedHandler = (detail) => { console.log("[v0] Enhanced LightGallery opened with zoom controls", detail); onOpened(detail) }
    const onClosedHandler = (detail) => { console.log("[v0] Enhanced LightGallery closed", detail); onClosed(detail) }

    const handleGridItemClick = (index) => { if (gridGalleryRef.current) { gridGalleryRef.current.openGallery(index) } }

    const renderGridView = () => (
        <div className="gallery-container">
            <div className={`gallery-grid ${className}`} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", padding: "20px", ...style }}>
                {items.map((item, index) => (
                    <div key={index} className="gallery-item group hover-scale" style={{ position: "relative", borderRadius: "16px", overflow: "hidden", cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", backgroundColor: "white" }} onClick={() => handleGridItemClick(index)} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.2)" }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)" }}>
                        {item.type === "video" ? (
                            <video src={item.url} style={{ width: "100%", height: "280px", objectFit: "cover" }} muted preload="metadata" />
                        ) : (
                            <img src={item.url || "/placeholder.svg?height=280&width=280&query=gallery image"} alt={item.alt || item.caption || "Gallery item"} style={{ width: "100%", height: "280px", objectFit: "cover" }} />
                        )}
                        <div className="gallery-overlay" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg, rgba(24, 119, 242, 0.9), rgba(99, 102, 241, 0.9))", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}>
                            <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "50%", width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "#1877f2", boxShadow: "0 6px 16px rgba(0,0,0,0.3)", transition: "all 0.2s ease" }}>🔍</div>
                        </div>
                        {item.caption && (
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", color: "white", padding: "30px 20px 20px", fontSize: "15px", fontWeight: "600" }}>{item.caption}</div>
                        )}
                    </div>
                ))}
            </div>

            <LightGallery ref={gridGalleryRef} speed={defaultSettings.speed} plugins={[lgThumbnail, lgVideo, lgZoom, lgFullscreen, lgAutoplay, lgRotate]} elementClassNames="hidden-lightgallery" onInit={onInitHandler} onBeforeOpen={onBeforeOpenHandler} onOpened={onOpenedHandler} onClosed={onClosedHandler} settings={defaultSettings} dynamic={true} dynamicEl={items.map((item, index) => ({ src: item.url, thumb: item.url, subHtml: `<div class="lg-sub-html"><h4 style="color: white; font-size: 18px; font-weight: 600; margin: 0;">${item.caption || `Image ${index + 1}`}</h4></div>`, downloadUrl: item.url, ...(item.type === "video" && { video: { source: [{ src: item.url, type: "video/mp4" }], attributes: { preload: false, controls: true } } }) }))} />
        </div>
    )

    const renderLightGallery = () => (
        <LightGallery ref={lightGalleryRef} speed={defaultSettings.speed} plugins={[lgThumbnail, lgVideo, lgZoom, lgFullscreen, lgAutoplay, lgRotate]} elementClassNames={`custom-lightgallery ${className}`} onInit={onInitHandler} onBeforeOpen={onBeforeOpenHandler} onOpened={onOpenedHandler} onClosed={onClosedHandler} settings={defaultSettings} style={style}>
            {items.map((item, index) => (
                <a key={index} href={item.url} data-lg-size="1400-933" data-sub-html={`<div class="lg-sub-html"><h4 style="color: white; font-size: 18px; font-weight: 600; margin: 0;">${item.caption || ""}</h4></div>`} data-download-url={item.url} data-download-filename={item.caption || `image-${index + 1}`} data-src={item.url} data-video={item.type === "video" ? JSON.stringify({ source: [{ src: item.url, type: "video/mp4" }], attributes: { preload: false, controls: true } }) : undefined}>
                    {item.type === "video" ? (
                        <video src={item.url} style={{ width: "100%", height: "450px", objectFit: "cover", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", transition: "all 0.3s ease", ...style }} muted preload="metadata" onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)" }} onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)" }} />
                    ) : (
                        <img src={item.url || "/placeholder.svg?height=450&width=680&query=post image"} alt={item.alt || item.caption || "Gallery item"} style={{ width: "100%", height: "450px", objectFit: "cover", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", transition: "all 0.3s ease", ...style }} onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)" }} onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)" }} />
                    )}
                </a>
            ))}
        </LightGallery>
    )

    return gridMode ? renderGridView() : renderLightGallery()
}

export default GalleryViewer