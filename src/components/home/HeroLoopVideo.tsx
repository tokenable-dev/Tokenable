"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import heroMain from "@/media/hero-main.mp4";
import heroTwo from "@/media/hero-2.mp4";

/** Bundled into `/_next/static/media/*` so production hosts serve them with the JS build (fewer CDN path issues vs `/public` alone). */
const CLIPS = [heroMain, heroTwo];

export function HeroLoopVideo() {
  const [index, setIndex] = useState(0);
  const src = CLIPS[index];
  const videoRef = useRef<HTMLVideoElement>(null);

  const onEnded = useCallback(() => {
    setIndex((prev) => (prev + 1) % CLIPS.length);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => {});
  }, [src]);

  return (
    <div className="absolute inset-0 min-h-[100dvh] w-full overflow-hidden">
      <video
        ref={videoRef}
        key={src}
        src={src}
        className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.01] object-cover object-center"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={onEnded}
        aria-hidden
      />
    </div>
  );
}
