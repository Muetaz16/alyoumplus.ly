"use client";

import { useEffect, useRef, useState } from "react";
import db from "@/lib/db";
import styles from "@/app/reels/page.module.css";

interface Video {
  id: number;
  title: string;
  description: string | null;
  type: string;
  url: string;
  thumbnail: string | null;
  views: number;
  likes: number;
  isFeatured: boolean;
  createdAt: Date | string;
  category?: { name: string; slug: string } | null;
}

interface ReelsListProps {
  initialReels: Video[];
}

export default function ReelsList({ initialReels }: ReelsListProps) {
  const [reels, setReels] = useState<Video[]>(initialReels);
  const [muted, setMuted] = useState(true);
  const [activeReelId, setActiveReelId] = useState<number | null>(null);
  const [likedReels, setLikedReels] = useState<{ [key: number]: boolean }>({});
  const [indicatorState, setIndicatorState] = useState<{ [key: number]: "play" | "pause" | null }>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const viewedReelsRef = useRef<Set<number>>(new Set());

  const isEmbeddableUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be") || url.includes("drive.google.com");
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";

    // Handle Google Drive
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    if (url.includes("embed/")) {
      return url;
    }
    // YouTube Shorts: https://youtube.com/shorts/VIDEO_ID
    const shortMatch = url.match(/shorts\/([^&#?]+)/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${shortMatch[1]}&controls=0&modestbranding=1`;
    }
    // YouTube Watch: watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([^&#]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${watchMatch[1]}&controls=0&modestbranding=1`;
    }
    // Short share link: youtu.be/VIDEO_ID
    const youtuMatch = url.match(/youtu\.be\/([^&#?]+)/);
    if (youtuMatch && youtuMatch[1]) {
      return `https://www.youtube.com/embed/${youtuMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${youtuMatch[1]}&controls=0&modestbranding=1`;
    }
    return url;
  };

  // 1. Setup IntersectionObserver to play/pause reels on scroll
  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.6,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const videoElement = entry.target.querySelector("video") as HTMLVideoElement;
        const reelId = parseInt(entry.target.getAttribute("data-reel-id") || "0");

        if (entry.isIntersecting) {
          setActiveReelId(reelId);
          if (videoElement) {
            videoElement.play().catch(() => {
              // Ignore autoplay restriction warnings
            });
          }
          // Increment view count in database on background
          incrementViewCount(reelId);
        } else {
          if (videoElement) {
            videoElement.pause();
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const children = containerRef.current?.querySelectorAll(`[data-reel-card]`);
    children?.forEach((child) => observer.observe(child));

    return () => {
      observer.disconnect();
    };
  }, [reels.length]);

  // 2. Increment view count in Firestore and update local state
  const incrementViewCount = async (id: number) => {
    if (viewedReelsRef.current.has(id)) return;
    
    try {
      const target = reels.find((r) => r.id === id);
      if (!target) return;

      viewedReelsRef.current.add(id);

      const updatedViews = target.views + 1;
      
      // Update local state first for instantaneous feel
      setReels((prev) =>
        prev.map((r) => (r.id === id ? { ...r, views: updatedViews } : r))
      );

      // Save to client-side serverless firestore
      await db.video.update({
        where: { id: id },
        data: { views: updatedViews },
      });
    } catch (e) {
      console.error("Error updating views in Firestore:", e);
    }
  };

  // 3. Like/Heart action
  const handleLike = async (id: number) => {
    const isLiked = likedReels[id];
    const target = reels.find((r) => r.id === id);
    if (!target) return;

    const newLikedState = !isLiked;
    const updatedLikes = target.likes + (newLikedState ? 1 : -1);

    setLikedReels((prev) => ({ ...prev, [id]: newLikedState }));
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: updatedLikes } : r))
    );

    // Save directly to Firestore client-side
    try {
      await db.video.update({
        where: { id: id },
        data: { likes: updatedLikes },
      });
    } catch (e) {
      console.error("Error updating likes in Firestore:", e);
    }
  };

  // 4. Play/Pause toggle on clicking the video screen
  const togglePlayPause = (id: number) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIndicatorState((prev) => ({ ...prev, [id]: "play" }));
    } else {
      video.pause();
    }

    // Reset center icon indicator after 800ms
    setTimeout(() => {
      setIndicatorState((prev) => ({ ...prev, [id]: null }));
    }, 800);
  };

  // 5. Global mute toggle
  const handleMuteToggle = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.muted = newMuted;
      }
    });
  };

  // 6. Share copy link
  const handleCopyLink = (id: number) => {
    const shareUrl = `${window.location.origin}/reels?id=${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (reels.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span style={{ fontSize: "3rem" }}>📱</span>
        <h3>لا توجد فيديوهات ريلز حالياً</h3>
        <p>قم بزيارة لوحة التحكم لإضافة فيديوهات ريلز قصيرة جديدة!</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.reelsWrapper} ref={containerRef}>
        
        {/* Global HUD Mute Indicator */}
        <div className={styles.muteOverlay}>
          <button onClick={handleMuteToggle} className={styles.muteButton} title="كتم/تشغيل الصوت">
            <span style={{ fontSize: "1.2rem" }}>{muted ? "🔇" : "🔊"}</span>
          </button>
        </div>

        {reels.map((reel) => {
          const isLiked = !!likedReels[reel.id];
          const playState = indicatorState[reel.id];
          const isYoutube = isEmbeddableUrl(reel.url);

          return (
            <div
              key={reel.id}
              className={styles.reelItem}
              data-reel-card
              data-reel-id={reel.id}
            >
              {/* Dynamic Widescreen/Vertical Cinema Embed player or standard HTML5 video tag */}
              {isYoutube ? (
                <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", backgroundColor: "#000" }}>
                  <iframe
                    src={getEmbedUrl(reel.url)}
                    title={reel.title}
                    className={styles.videoElement}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ 
                      border: "none", 
                      width: "100%", 
                      height: "100%", 
                      transform: "scale(1.35)", 
                      transformOrigin: "center center"
                    }}
                  />
                </div>
              ) : (
                <video
                  ref={(el) => { videoRefs.current[reel.id] = el; }}
                  src={reel.url}
                  className={styles.videoElement}
                  loop
                  muted={muted}
                  playsInline
                  onClick={() => togglePlayPause(reel.id)}
                  poster={reel.thumbnail || undefined}
                />
              )}

              {/* Big Play/Pause Center Indicator */}
              {playState && (
                <div className={`${styles.playPauseIndicator} ${styles.animateIndicator}`}>
                  <span style={{ fontSize: "2rem", color: "#fff" }}>
                    {playState === "play" ? "▶" : "⏸"}
                  </span>
                </div>
              )}



              {/* Text Description Overlay */}
              <div className={styles.infoOverlay}>
                {reel.category && (
                  <span className={styles.categoryTag}>{reel.category.name}</span>
                )}
                <h2 className={styles.title}>{reel.title}</h2>
                {reel.description && (
                  <p className={styles.description}>{reel.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
