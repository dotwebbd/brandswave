"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, ArrowUp, ArrowDown, Video, Check, AlertCircle } from "lucide-react";
import { extractYouTubeId, youtubeThumbnail, youtubeEmbedUrl } from "@/lib/youtube";

export interface ModelWorkVideoItem {
  id?: string;
  title: string;
  description?: string | null;
  youtubeUrl: string;
  sortOrder: number;
}

interface WorkVideosManagerProps {
  videos: ModelWorkVideoItem[];
  onChange: (videos: ModelWorkVideoItem[]) => void;
}

export function WorkVideosManager({ videos, onChange }: WorkVideosManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

  const parsedId = extractYouTubeId(youtubeUrl);

  const openAdd = () => {
    setEditingIndex(null);
    setTitle("");
    setDescription("");
    setYoutubeUrl("");
    setUrlError(null);
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const v = videos[index];
    setEditingIndex(index);
    setTitle(v.title);
    setDescription(v.description || "");
    setYoutubeUrl(v.youtubeUrl);
    setUrlError(null);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!title.trim()) {
      setUrlError("Title is required.");
      return;
    }
    const id = extractYouTubeId(youtubeUrl);
    if (!id) {
      setUrlError("Invalid YouTube URL. Please provide a valid watch, embed, shorts, or youtu.be link.");
      return;
    }

    const updated = [...videos];
    const newVideoItem: ModelWorkVideoItem = {
      ...(editingIndex !== null ? updated[editingIndex] : {}),
      title: title.trim(),
      description: description.trim() || null,
      youtubeUrl: youtubeUrl.trim(),
      sortOrder: editingIndex !== null ? updated[editingIndex].sortOrder : videos.length,
    };

    if (editingIndex !== null) {
      updated[editingIndex] = newVideoItem;
    } else {
      updated.push(newVideoItem);
    }

    onChange(updated);
    setModalOpen(false);
  };

  const handleRemove = (index: number) => {
    const updated = videos.filter((_, idx) => idx !== index).map((v, i) => ({ ...v, sortOrder: i }));
    onChange(updated);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= videos.length) return;

    const updated = [...videos];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);

    const reordered = updated.map((v, i) => ({ ...v, sortOrder: i }));
    onChange(reordered);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-foam/80">
            Work Videos & Commercials ({videos.length})
          </label>
          <p className="text-xs text-foam/50 mt-0.5">
            Add YouTube TVCs, brand films, and runway reels for this model.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="btn-ghost py-2 px-3 text-xs font-semibold inline-flex items-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5 text-glass" />
          <span>Add Video</span>
        </button>
      </div>

      {videos.length === 0 ? (
        <div
          onClick={openAdd}
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-foam/15 bg-tide/20 p-8 text-center transition-all hover:border-glass hover:bg-tide/50"
        >
          <div className="rounded-xl bg-swell/40 p-3 text-foam/60 mb-2">
            <Video className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foam">No work videos added yet</p>
          <p className="text-xs text-foam/50 mt-1">
            Click here to attach YouTube commercials or campaign reels
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {videos.map((item, index) => {
            const ytId = extractYouTubeId(item.youtubeUrl);
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-4 rounded-xl border border-foam/15 bg-tide/50 p-3 hover:bg-swell/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {ytId ? (
                    <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-abyss border border-foam/10">
                      <Image
                        src={youtubeThumbnail(ytId)}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg bg-swell/60">
                      <Video className="h-6 w-6 text-foam/50" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-foam truncate">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-foam/60 line-clamp-1">{item.description}</p>
                    )}
                    <span className="text-[11px] text-glass font-mono truncate block">
                      {ytId ? `YouTube ID: ${ytId}` : item.youtubeUrl}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, "up")}
                    className="rounded p-1 text-foam/50 hover:bg-swell hover:text-foam disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === videos.length - 1}
                    onClick={() => handleMove(index, "down")}
                    className="rounded p-1 text-foam/50 hover:bg-swell hover:text-foam disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(index)}
                    className="rounded px-2.5 py-1 text-xs font-medium text-foam/80 hover:bg-swell hover:text-foam"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="rounded p-1 text-red-400 hover:bg-red-500/20"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Video Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-abyss/80 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-2xl border border-foam/15 bg-tide p-6 shadow-2xl z-10 space-y-5">
            <h3 className="text-lg font-semibold text-foam">
              {editingIndex !== null ? "Edit Work Video" : "Add Work Video"}
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foam/70">
                  Video Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Apex Summer Campaign TVC"
                  className="input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foam/70">
                  YouTube URL or ID
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    setUrlError(null);
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
                  className="input"
                />
                {parsedId ? (
                  <p className="text-xs text-glass flex items-center gap-1 mt-1">
                    <Check className="h-3.5 w-3.5" />
                    Valid YouTube ID extracted: {parsedId}
                  </p>
                ) : youtubeUrl ? (
                  <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Could not parse video ID yet.
                  </p>
                ) : null}
              </div>

              {/* Live Preview if ID valid */}
              {parsedId && (
                <div className="overflow-hidden rounded-xl border border-foam/15 aspect-video bg-abyss">
                  <iframe
                    src={youtubeEmbedUrl(parsedId)}
                    title="Live preview"
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foam/70">
                  Role / Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="e.g. Lead protagonist in national television commercial"
                  className="input resize-none"
                />
              </div>

              {urlError && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                  {urlError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-foam/20 px-4 py-2 text-sm text-foam hover:bg-swell/50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="btn-primary py-2 px-5 text-sm"
              >
                {editingIndex !== null ? "Save Changes" : "Add to Model"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
