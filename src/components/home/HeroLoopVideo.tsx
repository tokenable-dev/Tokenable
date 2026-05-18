"use client";

import { useCallback, useState } from "react";

/** Hero background: play clips in order, then repeat (planner supplied two files instead of one). */
const CLIPS = ["/main.mp4", "/hero-2.mp4"] as const;

export function HeroLoopVideo() {
  const [index, setIndex] = useState(0);
  const src = CLIPS[index];

  const onEnded = useCallback(() => {
    setIndex((prev) => (prev + 1) % CLIPS.length);
  }, []);

  return (
    <video
      key={src}
      className="h-full w-full object-cover object-center"
      autoPlay
      muted
      playsInline
      preload="auto"
      onEnded={onEnded}
      aria-hidden
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
