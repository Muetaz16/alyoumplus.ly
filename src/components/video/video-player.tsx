"use client";

import { useEffect, useRef } from "react";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
}

export function VideoPlayer({ src, poster, autoplay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<ReturnType<typeof import("video.js").default> | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initPlayer() {
      if (!videoRef.current || !mounted) return;

      const videojs = (await import("video.js")).default;
      const isHls = src.includes(".m3u8") || src.includes("m3u8");

      if (isHls && typeof window !== "undefined") {
        const Hls = (await import("hls.js")).default;
        if (Hls.isSupported() && videoRef.current) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(videoRef.current);
        }
      }

      if (playerRef.current) {
        playerRef.current.dispose();
      }

      playerRef.current = videojs(videoRef.current, {
        controls: true,
        fluid: true,
        responsive: true,
        autoplay,
        poster,
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
        controlBar: {
          pictureInPictureToggle: true,
          qualitySelector: true,
        },
        sources: isHls
          ? [{ src, type: "application/x-mpegURL" }]
          : [{ src, type: "video/mp4" }],
      });
    }

    initPlayer();

    return () => {
      mounted = false;
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, autoplay]);

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl bg-black">
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered vjs-theme-city w-full"
        playsInline
        crossOrigin="anonymous"
      />
    </div>
  );
}
