"use client";

import { youtubeEmbedUrl, youtubeThumbnail } from "@/lib/youtube";
import Image from "next/image";
import { Play, PlayCircle } from "lucide-react";

interface ProfileVideoProps {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
}

interface ProfileVideosProps {
  videos: ProfileVideoProps[];
}

export function ProfileVideos({ videos }: ProfileVideosProps) {
  if (videos.length === 0) return null;

  return (
    <section className="py-16" aria-labelledby="profile-videos-heading">
      <div className="container-page">
        <div className="flex items-center justify-between mb-10">
          <h2 id="profile-videos-heading" className="text-2xl font-semibold text-foam">Selected Work</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {videos.map((video) => {
            const ytId = extractYouTubeId(video.youtubeUrl);
            if (!ytId) return null;
            return (
              <article key={video.id} className="group relative rounded-xl overflow-hidden border border-foam/10 bg-tide/30 aspect-[16/9]">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={youtubeThumbnail(ytId)}
                    alt={`${video.title} thumbnail`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-glass text-abyss shadow-lg">
                      <Play className="h-5 w-5 ml-0.5" aria-hidden />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 p-3">
                  <h4 className="font-semibold text-foam line-clamp-1">{video.title}</h4>
                  {video.description && (
                    <p className="text-xs text-foam/50 line-clamp-2 mt-1">{video.description}</p>
                  )}
                </div>
                <a
                  href={youtubeEmbedUrl(ytId, false)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label={`Watch ${video.title} on YouTube`}
                >
                  <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-glass opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function extractYouTubeId(input: string): string | null {
  const ID_RE = /^[a-zA-Z0-9_-]{11}$/;
  const value = input.trim();
  if (ID_RE.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return url.pathname.slice(1).split("/")[0];
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (url.pathname === "/watch") return url.searchParams.get("v");
      const [, kind, maybeId] = url.pathname.split("/");
      if (["embed", "shorts", "live", "v"].includes(kind)) return maybeId;
    }
    return null;
  } catch {
    return null;
  }
}