"use client";

import { useRef, useState } from "react";
import { toDirectImageUrl } from "@/lib/utils";
import styles from "./VideoRow.module.css";
import VideoModal from "./VideoModal";

interface Category {
  name: string;
  slug: string;
}

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
  category?: Category | null;
}

interface VideoRowProps {
  title: string;
  videos: Video[];
}

export default function VideoRow({ title, videos }: VideoRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  // Helper to extract YouTube video ID for clean default thumbnail fallback
  const getFallbackThumbnail = (url: string) => {
    let videoId = "default";
    try {
      if (url.includes("shorts/")) {
        const parts = url.split("shorts/");
        if (parts[1]) videoId = parts[1].split("?")[0].split("&")[0];
      } else if (url.includes("embed/")) {
        const parts = url.split("embed/");
        if (parts[1]) videoId = parts[1].split("?")[0].split("&")[0];
      } else if (url.includes("v=")) {
        const parts = url.split("v=");
        if (parts[1]) videoId = parts[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        const parts = url.split("youtu.be/");
        if (parts[1]) videoId = parts[1].split("?")[0].split("&")[0];
      }
    } catch (e) {
      console.error("Failed to parse video ID:", e);
    }
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth * 0.75
          : scrollLeft + clientWidth * 0.75;
      
      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  if (videos.length === 0) return null;

  return (
    <div className={styles.rowContainer}>
      <div className={styles.rowHeader}>
        <h2 className={styles.rowTitle}>{title}</h2>
      </div>

      <div className={styles.sliderWrapper}>
        {/* Navigation Arrow Left */}
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={() => handleScroll("left")}
          aria-label="Scroll left"
        >
          ‹
        </button>

        {/* Horizontal Scroll Container */}
        <div ref={rowRef} className={styles.rowInner}>
          {videos.map((video) => (
            <div
              key={video.id}
              className={`${styles.card} glass-card`}
              onClick={() => setActiveVideo(video)}
            >
              <div className={styles.thumbnailArea}>
                <img
                  src={toDirectImageUrl(video.thumbnail) || getFallbackThumbnail(video.url)}
                  alt={video.title}
                  className={styles.thumbnail}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackThumbnail(video.url);
                  }}
                />
                
                {/* Live or standard duration badge overlay */}
                {video.category?.slug === "live" || video.type === "live" ? (
                  <span className={styles.liveBadge}>مباشر</span>
                ) : (
                  <span className={styles.typeBadge}>تقرير</span>
                )}

                <div className={styles.playOverlay}>
                  <div className={styles.playBtn}>▶</div>
                </div>
              </div>

              <div className={styles.cardDetails}>
                <h4 className={styles.cardTitle}>{video.title}</h4>
                {video.category && (
                  <span className={styles.categoryName}>{video.category.name}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrow Right */}
        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={() => handleScroll("right")}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>

      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
}
