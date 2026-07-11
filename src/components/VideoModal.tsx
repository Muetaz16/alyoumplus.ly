"use client";

import { useState } from "react";
import { toDirectImageUrl } from "@/lib/utils";

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

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const [modalTab, setModalTab] = useState<"description" | "contact">("description");

  if (!video) return null;

  // Parse standard YouTube or Google Drive URL to get the secure embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return "";

    // Handle Google Drive
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    if (url.includes("embed/")) {
      return `${url}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
    }
    
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      const parts = url.split("v=");
      if (parts[1]) {
        videoId = parts[1].split("&")[0];
      }
    } else if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/");
      if (parts[1]) {
        videoId = parts[1].split("?")[0];
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
    }
    return url;
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(3, 4, 7, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        zIndex: 3000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* Main Enclosure */}
      <div
        onClick={(e) => e.stopPropagation()} // Guard from closing overlay on inner clicks
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: "rgba(11, 15, 26, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          padding: "24px",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.8)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span 
              style={{
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                fontSize: "0.75rem",
                fontWeight: "700",
                padding: "4px 10px",
                borderRadius: "20px"
              }}
            >
              {video.category ? video.category.name : "فيديو مميز"}
            </span>
            <h3 style={{ color: "#fff", fontSize: "1.15rem", fontWeight: "800", margin: 0 }}>
              {video.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              color: "#fff",
              fontSize: "1.1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            ✕
          </button>
        </div>

        {/* Split Screen Columns */}
        <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}>
          {/* Column 1: Cinematic Iframe Video Player */}
          <div
            style={{
              flex: "1 1 62%",
              minWidth: "320px",
              aspectRatio: "16/9",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "#000",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
            }}
          >
            <iframe
              src={getEmbedUrl(video.url)}
              title={video.title}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Column 2: Gorgeous Scrolling Tabbed Sidebar */}
          <div
            style={{
              flex: "1 1 32%",
              minWidth: "280px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "20px",
              padding: "20px",
              maxHeight: "360px",
              overflowY: "auto",
            }}
          >
            {/* Tab Controls */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "10px", gap: "10px" }}>
              <button
                onClick={() => setModalTab("description")}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  background: modalTab === "description" ? "var(--primary)" : "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                📄 تفاصيل التقرير
              </button>
              <button
                onClick={() => setModalTab("contact")}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  background: modalTab === "contact" ? "var(--primary)" : "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "0.85rem",
                  fontWeight: "750",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                💬 تواصل معنا
              </button>
            </div>

            {/* Tab 1: Video Description */}
            {modalTab === "description" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#a3a3a3", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "10px" }}>
                  <span>📅 {new Date(video.createdAt).toLocaleDateString("ar-LY")}</span>
                </div>
                <p style={{ color: "#cbd5e1", fontSize: "0.88rem", lineHeight: "1.7", margin: 0 }}>
                  {video.description || "لا يوجد وصف متوفر لهذا الفيديو حالياً."}
                </p>
              </div>
            )}

            {/* Tab 2: Direct Contact Form/Channels */}
            {modalTab === "contact" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: "1.6", margin: 0 }}>
                  لديك استفسار أو ترغب في الإعلان في قنوات ليبيا بلس بخصوص هذا التقرير؟ تواصل فوراً مع فريق الإدارة عبر إحدى القنوات الآتية:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <a
                    href={`https://wa.me/218928175897?text=${encodeURIComponent("السلام عليكم، أرغب في الاستفسار أو الإعلان بخصوص التقرير: " + video.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px",
                      background: "rgba(34, 197, 94, 0.1)",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                      borderRadius: "10px",
                      color: "#22c55e",
                      fontWeight: "750",
                      textDecoration: "none",
                      fontSize: "0.82rem",
                      transition: "all 0.2s"
                    }}
                  >
                    🟢 واتساب الإدارة المباشر
                  </a>

                  <a
                    href="https://t.me/+218928175897"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px",
                      background: "rgba(14, 165, 233, 0.1)",
                      border: "1px solid rgba(14, 165, 233, 0.2)",
                      borderRadius: "10px",
                      color: "#0ea5e9",
                      fontWeight: "750",
                      textDecoration: "none",
                      fontSize: "0.82rem",
                      transition: "all 0.2s"
                    }}
                  >
                    🔵 تيليجرام الإدارة المباشر
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
