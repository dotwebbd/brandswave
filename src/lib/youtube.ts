const ID_RE = /^[a-zA-Z0-9_-]{11}$/;

/** Accepts watch, youtu.be, embed, shorts and live URLs, or a bare 11-char id. */
export function extractYouTubeId(input: string): string | null {
  const value = input.trim();
  if (ID_RE.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
    else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else {
        const [, kind, maybeId] = url.pathname.split("/");
        if (["embed", "shorts", "live", "v"].includes(kind)) id = maybeId;
      }
    }
    return id && ID_RE.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** Privacy-friendly embed with no related-video suggestions. */
export function youtubeEmbedUrl(id: string, autoplay = false) {
  const params = new URLSearchParams({ rel: "0", modestbranding: "1", playsinline: "1" });
  if (autoplay) params.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export const youtubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
