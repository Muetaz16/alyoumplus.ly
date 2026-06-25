"use client";

import { useState } from "react";
import { toDirectImageUrl } from "@/lib/utils";
import styles from "@/app/page.module.css";
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

interface YouTubeGridProps {
  initialVideos: Video[];
}

export default function YouTubeGrid({ initialVideos }: YouTubeGridProps) {
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

  if (initialVideos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>لا توجد فيديوهات في هذا القسم حالياً</h3>
        <p style={{ marginTop: "8px" }}>تفضل بزيارة الأقسام الأخرى أو تصفح البث المباشر والريلز!</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.postsGrid}>
        {initialVideos.map((video) => (
          <div
            key={video.id}
            className={`${styles.postCard} glass-card`}
            style={{ cursor: "pointer" }}
            onClick={() => setActiveVideo(video)}
          >
            <div className={styles.thumbnailWrapper}>
              <img
                src={toDirectImageUrl(video.thumbnail) || getFallbackThumbnail(video.url)}
                alt={video.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackThumbnail(video.url);
                }}
              />
              {video.category && <span className={styles.postTag}>{video.category.name}</span>}
              <div className={styles.playIconWrapper}>
                <span>▶</span>
              </div>
            </div>
            
            <div className={styles.postDetails}>
              <h3 className={styles.postTitle}>{video.title}</h3>
              {video.description && <p className={styles.postDesc}>{video.description}</p>}
              <div className={styles.postMeta}>
                <span>📅 {new Date(video.createdAt).toLocaleDateString("ar-LY")}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveVideo(video);
                }}
                className="btn btn-secondary"
                style={{ marginTop: "14px", width: "100%", fontSize: "0.85rem", gap: "6px" }}
              >
                📺 شاهد الآن واقرأ التفاصيل
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
}
