"use client";

import { useEffect } from "react";

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/videos/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
