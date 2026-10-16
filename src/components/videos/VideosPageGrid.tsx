"use client";

import { useState } from "react";
import { VideoCard } from "@/components/videos/VideoCard";
import { VideoModal } from "@/components/videos/VideoModal";
import type { Video } from "@/lib/data/videos";

interface VideosPageGridProps {
  items: Video[];
}

export function VideosPageGrid({ items }: VideosPageGridProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((video) => (
          <div key={video.id}>
            <VideoCard
              video={video}
              onClick={() => setSelectedVideo(video)}
            />
          </div>
        ))}
      </div>

      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          youtubeId={selectedVideo.youtubeId}
          title={selectedVideo.title}
          orientation={selectedVideo.orientation}
        />
      )}
    </>
  );
}
